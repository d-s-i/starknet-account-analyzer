import { Helper } from "./Helper";
import { GetBlockResponse, InvokeFunctionTransaction } from "starknet-analyzer/src/types/rawStarknet";
import { StandardProvider } from "starknet-analyzer/src/types";
import { ContractDataTree, BlocksTree } from "./types";
import { Provider } from "starknet";
import { getSelectorFromName } from "starknet/utils/hash";
import { DeployTransaction } from "starknet/types";

export class OnChainHelper {

    private _provider: StandardProvider<Provider>;
    private _msBetweekBlockQuery: number;
    private _EXECUTE_SELECTOR: string;
    private _AVG_STARKNET_MIN_PER_BLOCK = 1.5; // 1min30s
    private _STARKNET_BLOCKS_PER_DAY =  Helper.MIN_PER_DAY / this.AVG_STARKNET_MIN_PER_BLOCK;
    private _blocks: BlocksTree;
    
    constructor(provider: StandardProvider<Provider>, blocks?: BlocksTree, msBetweekBlockQuery?: number) {
        this._provider = provider;
        this._EXECUTE_SELECTOR = getSelectorFromName("__execute__");
        this._blocks = blocks || {};
        this._msBetweekBlockQuery = msBetweekBlockQuery || 0;
    }
    
    async getYesterdayBlockRange() {
        const latestBlockNumber = await this._getLatestBlockNumber();
        const startBlockNumber = latestBlockNumber - this.STARKNET_BLOCKS_PER_DAY;

        return [startBlockNumber, latestBlockNumber];
    }
    
    async _getAllTransactionsWithinBlockRange(startBlockNumber: number, endBlockNumber: number) {

        const milestones = Helper.getMilestones(startBlockNumber, endBlockNumber);
        
        let allTransactions = [];
        // TODO: Add fee per transaction => sort address per fee spent
        for(let i = startBlockNumber; i <= endBlockNumber; i++) {
            Helper.displayProgress(milestones, i, "fetching blocks");
            const _block = await this.getBlock(i.toString());
            const block = Helper.forceCast(_block) as GetBlockResponse;
            allTransactions.push(...block.transactions);
        }
    
        return allTransactions;
    }
    
    async _getLatestBlockNumber() {
        const latestBlock = await this.provider.getBlock("pending");
        if(isNaN(latestBlock.block_number)) {
            throw new Error(
                `OnChainHelper::_getLatestBlockNumber - latestBlockNumber is not a number (latestBlockNumber: ${latestBlock.block_number})`
            );
        }
        return latestBlock.block_number;
    }

    async getBlock(blockNumber: string) {
        if(this.blocks[blockNumber]) {
            return this.blocks[blockNumber];
        } else {
            const _block = await this.provider.getBlock(blockNumber);
            const block = Helper.forceCast(_block) as GetBlockResponse;
            this._blocks[blockNumber] = block;
            await Helper.sleep(this._msBetweekBlockQuery);
            return block;
        }
    }

    _getContractsActivity(transactions: (DeployTransaction | InvokeFunctionTransaction)[]) {
        let contractsActivity: ContractDataTree = {};
        for(const tx of transactions) {
            if(tx.type === "DEPLOY") continue;
            // const type = this._getContractType(tx);
    
            let amount = contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].transactionCount;
            
            let rawTransactions;
            if(contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].rawTransactions) {
                rawTransactions = [...contractsActivity[tx.contract_address].rawTransactions, tx];
            } else {
                rawTransactions = [tx];
            }
    
            contractsActivity[tx.contract_address] = {
                transactionCount: isNaN(amount) ? 1 : amount + 1,
                type: (contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].type === "ACCOUNT_CONTRACT") ? "ACCOUNT_CONTRACT" : this._getContractType(tx),
                rawTransactions
            };
        }

        return contractsActivity;
    }
    
    _getContractType(transaction: InvokeFunctionTransaction) {
        // assuming accounts contract calls `__execute__`
        // other solution : calling `get_signer` for Argent Accounts or `get_public_key` for OpenZeppelin Accounts, but it is very long
        return transaction.entry_point_selector === this.EXECUTE_SELECTOR ? "ACCOUNT_CONTRACT" : "GENERAL_CONTRACT";
    }
    
    get provider() {
        return this._provider;
    }

    get blocks() {
        return this._blocks;
    }

    get EXECUTE_SELECTOR() {
        return this._EXECUTE_SELECTOR;
    }
    
    get AVG_STARKNET_MIN_PER_BLOCK() {
        return this._AVG_STARKNET_MIN_PER_BLOCK
    }

    get STARKNET_BLOCKS_PER_DAY() {
        return this._STARKNET_BLOCKS_PER_DAY
    }
}