import { usePublicClient, useAccount, useReadContract } from 'wagmi'
import { contractAddress, contractAbi } from '@/lib/contract'
import { useEffect, useState } from 'react'
import { parseAbiItem } from 'viem'
import { useGetAllMedicines } from './useFactory'

export interface PrescriptionEvent {
    medicineId: number
    patient: string
    doctor: string
    timestamp: number
    transactionHash: string
    blockNumber: bigint
}

export interface PatientMedicine {
    id: number
    name: string
    activeIngredient: string
    balance: number
}

export function usePatientPrescriptions() {
    const publicClient = usePublicClient()
    const { address } = useAccount()
    const [history, setHistory] = useState<PrescriptionEvent[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            if (!publicClient || !address) return

            setIsLoadingHistory(true)
            try {
                // Filter logs where 'patient' matches the connected address
                const logs = await publicClient.getLogs({
                    address: contractAddress as `0x${string}`,
                    event: parseAbiItem('event PrescriptionIssued(uint256 indexed medicineId, address indexed patient, address indexed doctor, uint256 timestamp)'),
                    args: {
                        patient: address as `0x${string}`
                    },
                    fromBlock: BigInt(30283583) // Optimization for testnet
                })

                const formattedLogs = logs.map(log => ({
                    medicineId: Number(log.args.medicineId),
                    patient: log.args.patient!,
                    doctor: log.args.doctor!,
                    timestamp: Number(log.args.timestamp),
                    transactionHash: log.transactionHash,
                    blockNumber: log.blockNumber
                })).sort((a, b) => Number(b.blockNumber - a.blockNumber))

                setHistory(formattedLogs)
            } catch (e) {
                console.error("Error fetching patient prescriptions:", e)
            } finally {
                setIsLoadingHistory(false)
            }
        }

        fetchHistory()
    }, [publicClient, address])

    return { history, isLoadingHistory }
}

export function usePatientMedicines() {
    const { address } = useAccount()
    const { medicines, isLoading: isLoadingMetadata } = useGetAllMedicines()

    const accounts = address && medicines.length > 0
        ? Array(medicines.length).fill(address)
        : []

    const ids = medicines.length > 0
        ? medicines.map((_, index) => BigInt(index))
        : []

    const { data: balances, isPending: isLoadingBalances, refetch } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'balanceOfBatch',
        args: [accounts, ids],
        query: {
            enabled: !!address && medicines.length > 0
        }
    })

    const [ownedMedicines, setOwnedMedicines] = useState<PatientMedicine[]>([])

    useEffect(() => {
        if (medicines.length > 0 && balances) {
            const mappedMedicines = (balances as bigint[]).map((balance, index) => {
                const bal = Number(balance)
                if (bal > 0) {
                    return {
                        id: index,
                        name: medicines[index].name,
                        activeIngredient: medicines[index].activeIngredient,
                        balance: bal
                    }
                }
                return null
            }).filter((item): item is PatientMedicine => item !== null)

            setOwnedMedicines(mappedMedicines)
        } else {
            setOwnedMedicines([])
        }
    }, [medicines, balances])

    return {
        ownedMedicines,
        isLoading: isLoadingMetadata || isLoadingBalances,
        refetch
    }
}
