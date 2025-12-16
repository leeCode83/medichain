import { useWriteContract, useWaitForTransactionReceipt, usePublicClient, useAccount } from 'wagmi'
import { contractAbi, contractAddress } from '@/lib/contract'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { parseAbiItem } from 'viem'

export interface DiagnosisData {
    patientName: string
    gender: string
    age: number
    patientAddress: string
    diagnosis: string
    medicine: Record<string, number>
}

export interface PrescriptionEvent {
    medicineId: number
    patient: string
    doctor: string
    timestamp: number
    transactionHash: string
    blockNumber: bigint
}

export function useUploadDiagnosis() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const uploadDiagnosis = async (data: DiagnosisData): Promise<string | null> => {
        setIsUploading(true)
        setUploadError(null)

        try {
            const jsonString = JSON.stringify(data)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const file = new File([blob], `diagnosis-${Date.now()}.json`, { type: 'application/json' })

            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/pinata", {
                method: "POST",
                body: formData,
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || "Failed to upload diagnosis to IPFS")
            }

            return responseData // The API returns the URL directly as JSON
        } catch (error) {
            console.error("Error uploading diagnosis:", error)
            setUploadError(error instanceof Error ? error.message : "Unknown error")
            return null
        } finally {
            setIsUploading(false)
        }
    }

    return {
        uploadDiagnosis,
        isUploading,
        uploadError
    }
}

export function useDispenseMedicine() {
    const {
        data: hash,
        error: writeError,
        isPending: isWritePending,
        writeContract
    } = useWriteContract()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError
    } = useWaitForTransactionReceipt({
        hash,
    })

    const dispenseMedicine = async (medicineId: number, patientAddress: string, diagnosisHash: string) => {
        try {
            writeContract({
                address: contractAddress as `0x${string}`,
                abi: contractAbi,
                functionName: 'dispenseMedicine',
                args: [BigInt(medicineId), patientAddress as `0x${string}`, diagnosisHash],
            })
        } catch (error) {
            console.error("Error dispensing medicine:", error)
        }
    }

    // Side effects for User Feedback
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Prescription Issued!", {
                description: "Medicine has been dispensed and recorded on the blockchain.",
                duration: 5000,
            })
        }

        if (writeError) {
            toast.error("Transaction Failed", {
                description: writeError.message.split('\n')[0] || "Unknown error occurred",
                duration: 5000,
            })
        }

        if (receiptError) {
            toast.error("Transaction Failed", {
                description: "Transaction was reverted on-chain.",
                duration: 5000,
            })
        }
    }, [isConfirmed, writeError, receiptError])

    return {
        dispenseMedicine,
        hash,
        isPending: isWritePending || isConfirming,
        isConfirmed,
        error: writeError || receiptError
    }
}

export function useDoctorPrescriptions() {
    const publicClient = usePublicClient()
    const { address } = useAccount()
    const [history, setHistory] = useState<PrescriptionEvent[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            if (!publicClient || !address) return
            
            setIsLoadingHistory(true)
            try {
                const logs = await publicClient.getLogs({
                    address: contractAddress as `0x${string}`,
                    event: parseAbiItem('event PrescriptionIssued(uint256 indexed medicineId, address indexed patient, address indexed doctor, uint256 timestamp)'),
                    args: {
                        doctor: address as `0x${string}` 
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
                console.error(e)
            } finally {
                setIsLoadingHistory(false)
            }
        }
        
        fetchHistory()
    }, [publicClient, address])

    return { history, isLoadingHistory }
}
