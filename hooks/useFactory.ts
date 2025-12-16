import { useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from 'wagmi'
import { contractAbi, contractAddress, type MedicineType } from '@/lib/contract'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { parseAbiItem } from 'viem'

export function useGetAllMedicines() {
    const { data: medicines, isPending, error, refetch } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'getAllMedicineTypes',
    })

    return {
        medicines: (medicines as unknown as MedicineType[]) || [],
        isLoading: isPending,
        error,
        refetch
    }
}

export function useCreateMedicine() {
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

    const createMedicine = async (name: string, activeIngredient: string) => {
        try {
            writeContract({
                address: contractAddress as `0x${string}`,
                abi: contractAbi,
                functionName: 'createNewMedicineType',
                args: [name, activeIngredient],
            })
        } catch (error) {
            console.error("Error creating medicine:", error)
        }
    }

    // Side effects for User Feedback
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Transaction Successful!", {
                description: "New Medicine Type has been registered on the blockchain.",
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
        createMedicine,
        hash,
        isPending: isWritePending || isConfirming,
        isConfirmed,
        error: writeError || receiptError
    }
}

export function useRestockMedicine() {
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

    const restockMedicine = async (medicineId: number, quantity: number) => {
        try {
            writeContract({
                address: contractAddress as `0x${string}`,
                abi: contractAbi,
                functionName: 'restockMedicineBatch',
                args: [BigInt(medicineId), BigInt(quantity)],
            })
        } catch (error) {
            console.error("Error restocking medicine:", error)
        }
    }

    // Side effects for User Feedback
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Restock Successful!", {
                description: "Medicine stock has been updated on the blockchain.",
                duration: 5000,
            })
        }

        if (writeError) {
            toast.error("Restock Failed", {
                description: writeError.message.split('\n')[0] || "Unknown error occurred",
                duration: 5000,
            })
        }

        if (receiptError) {
            toast.error("Restock Failed", {
                description: "Transaction was reverted on-chain.",
                duration: 5000,
            })
        }
    }, [isConfirmed, writeError, receiptError])

    return {
        restockMedicine,
        hash,
        isPending: isWritePending || isConfirming,
        isConfirmed,
        error: writeError || receiptError
    }
}

export function useRestockHistory() {
    const publicClient = usePublicClient()
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchHistory = async () => {
            if (!publicClient) return

            setIsLoading(true)
            setError(null)

            try {
                // Fetch event logs
                const logs = await publicClient.getLogs({
                    address: contractAddress as `0x${string}`,
                    event: parseAbiItem('event MedicineRestocked(uint256 indexed medicineId, uint256 quantity)'),
                    fromBlock: BigInt(30283583)
                })

                // Format logs
                const formattedLogs = logs.map(log => ({
                    medicineId: Number(log.args.medicineId),
                    quantity: Number(log.args.quantity),
                    blockNumber: log.blockNumber,
                    transactionHash: log.transactionHash
                }))

                // Sort by block number descending (newest first)
                formattedLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))

                setHistory(formattedLogs)
            } catch (err) {
                console.error("Error fetching restock history:", err)
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHistory()
    }, [publicClient])

    return {
        history,
        isLoading,
        error
    }
}
