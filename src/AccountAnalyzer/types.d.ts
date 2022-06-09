import { FunctionCall } from "starknet-analyzer/src/types/organizedStarknet";
import { GetBlockResponse, InvokeFunctionTransaction } from "starknet-analyzer/src/types/rawStarknet";

export interface ContractDataTree {
    [key: string]: ContractData
}

export interface ContractData { 
    transactionCount: number, 
    type: string,
    rawTransactions: InvokeFunctionTransaction[],
    organizedTransactions?: OrganizedTransaction[]
} 

export interface OrganizedTransaction {
    transactionHash: string,
    organizedFunctionCalls: FunctionCall[]
}

export interface BlocksTree { [key: string]: GetBlockResponse }

export interface RangeMilestones {
    milestoneOne: number, 
    milestoneTwo: number, 
    milestoneThree: number, 
    milestoneFour: number 
}
