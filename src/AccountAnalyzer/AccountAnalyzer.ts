import { OnChainHelper } from "./OnChainHelper";
import { TransactionCallOrganizer } from "starknet-analyzer/lib/organizers/TransactionCallOrganizer";
import { DeployTransaction } from "starknet/types";
import { InvokeFunctionTransaction } from "starknet-analyzer/src/types/rawStarknet";
import { StandardProvider } from "starknet-analyzer/src/types";
import { ContractData, ContractDataTree, BlocksTree, OrganizedTransaction } from "./types.d";

import { Provider } from "starknet";

export class AccountAnalyzer extends OnChainHelper {

    private _sortedContractsActivity: ContractDataTree;
    private _organizedAccountsActivity: ContractDataTree;
    
    constructor(provider: StandardProvider<Provider>, blocks?: BlocksTree, msBetweenBlockQuery?: number) {
        super(provider, blocks, msBetweenBlockQuery);
        this._sortedContractsActivity = {};
        this._organizedAccountsActivity = {};
    }
    
    async getTopAccountsFromBlockNumbers(startBlockNumber: number, endBlockNumber: number) {
        
        console.log(`\nStarting at ${startBlockNumber} and ending at ${endBlockNumber} (${endBlockNumber - startBlockNumber} blocks total)`);

        const allTransactions = await super._getAllTransactionsWithinBlockRange(startBlockNumber, endBlockNumber) as (DeployTransaction | InvokeFunctionTransaction)[];
            
        const contractsActivity = super._getContractsActivity(allTransactions);
    
        this._sortedContractsActivity = this._sortContractsPerActivity(contractsActivity);
    
        console.log("Done getting top accounts.");
        return this;
    }

    async organizeTransactionsForAccounts(amount: number, _sortedAccountsActivity?: ContractDataTree) {
        const sortedContractsActivity = this._getSortedContractsActivity(_sortedAccountsActivity); 
        let organizedSortedAccountsActivity: Required<ContractDataTree> = {};
        
        const transactionCallOrganizer = new TransactionCallOrganizer(this.provider);
    
        let i = 0;
        for(const key in sortedContractsActivity) {
            if(sortedContractsActivity[key].type === "GENERAL_CONTRACT") continue;
            if(i >= amount) break;
            const organizedTransactions = await this.organizeTransactionsForAccount(sortedContractsActivity[key], transactionCallOrganizer);
            organizedSortedAccountsActivity[key] = { ...sortedContractsActivity[key], organizedTransactions: organizedTransactions };
            i++;
        }
    
        this._organizedAccountsActivity = organizedSortedAccountsActivity;
        return this;
    }

    async organizeTransactionsForAccount(account: ContractData, _transactionCallOrganizer?: TransactionCallOrganizer) {
        const transactionCallOrganizer = _transactionCallOrganizer ? _transactionCallOrganizer : new TransactionCallOrganizer(this.provider);
        let organizedTx: OrganizedTransaction[] = [];
        for(const tx of account.rawTransactions) {
            try {
                const _organizedFunctionCalls = await transactionCallOrganizer.getCalldataPerCallFromTx(tx);
                if(_organizedFunctionCalls) {
                    organizedTx.push({
                        transactionHash: tx.transaction_hash,
                        organizedFunctionCalls: _organizedFunctionCalls
                    });
                }
            } catch(error) {
                console.log(`error with tx ${tx.transaction_hash}`);
                console.log(error);
            }
        }
        return organizedTx;
    }
    
    _sortContractsPerActivity(contractInteractions: ContractDataTree) {
        const sortedContractsArray = Object.entries(contractInteractions).sort(([, amountA], [, amountB]) => {
            return amountB.transactionCount - amountA.transactionCount;
        });
        let sortedContractsObject: ContractDataTree = {};
        for(const [addr, contractObject] of sortedContractsArray) {
            sortedContractsObject[addr] = contractObject;
        }
    
        return sortedContractsObject;
    }

    _getSortedContractsActivity(_sortedContractsActivity?: ContractDataTree) {
        return _sortedContractsActivity ? _sortedContractsActivity : this.sortedContractsActivity; 
    }

    get sortedContractsActivity() {
        return this._sortedContractsActivity;
    }

    get organizedAccountsActivity() {
        return this._organizedAccountsActivity;
    }
    
}