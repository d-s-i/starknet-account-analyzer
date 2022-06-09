# Account Analyzer

### Installation 

`npm i starknet-account-analyzer`

### Declaration

You declare the package with:

1. A provider

The package comes with a custom RPC provider (only useful functions have been implemented and follow the behavior of the starknetjs Provider)

2. Blocks

This can be an empty object, in this case the class will query the blocks to your provider, but you can also provider already fetched blocks (following a starknetjs block interface) to avoid losing time fetching blocks.

3. Time between block queries. 

In case you have to fecth blocks, you can chose a sleep time to avoid spamming the provider

```
import { AccountAnalyzer } from "starknet-account-analyzer/lib/AccountAnalyzer/AccountAnalyzer";

import { RPCProvider } from "./RPCProvider/RPCProvider";

const URL = "http://127.0.0.1:9545";
const provider = new RPCProvider(URL);

const accountAnalyzer = new AccountAnalyzer(provider, {}, 500);
```


### Example

Here is a full example of how you can use the package.

1. Fetch blocks

2. Organize all the activity from any contracts that made or received a transaction within those blocks

3. Filter the most active ACCOUNTS (accounts = a contract called `__execute__` at least once)

4. See the returned object with organized transactions

```
import { AccountAnalyzer } from "starknet-account-analyzer/lib/AccountAnalyzer/AccountAnalyzer";

import { RPCProvider } from "./RPCProvider/RPCProvider";

const URL = "http://127.0.0.1:9545";
const provider = new RPCProvider(URL);

const accountAnalyzer = new AccountAnalyzer(provider, {}, 500);

export const fetchBlocksAndContractsAndAccounts = async function() {
    const accountAnalyzer = new AccountAnalyzer(provider, {}, 500);
    const [startBlockNumber, latestBlockNumber] = await accountAnalyzer.getYesterdayBlockRange();
    const sortedContractsActivity = (
        await accountAnalyzer.getTopAccountsFromBlockNumbers(startBlockNumber, latestBlockNumber)
    ).sortedContractsActivity;

    const organizedAccountsActivity = (
        await accountAnalyzer.organizeTransactionsForAccounts(15, sortedContractsActivity)
    ).organizedAccountsActivity;

    return { 
        blocks: accountAnalyzer.blocks, 
        sortedContractsActivity,
        organizedAccountsActivity
    };
}

fetchBlocksAndContractsAndAccounts();
```