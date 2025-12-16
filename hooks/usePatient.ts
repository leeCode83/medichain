import { usePublicClient, useAccount } from 'wagmi'
import { contractAddress } from '@/lib/contract'
import { useEffect, useState } from 'react'
import { parseAbiItem } from 'viem'

export interface PrescriptionEvent {
    medicineId: number
    patient: string
    doctor: string
    timestamp: number
    transactionHash: string
    blockNumber: bigint
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
