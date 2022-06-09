"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainHelper = void 0;
var Helper_1 = require("./Helper");
var hash_1 = require("starknet/utils/hash");
var OnChainHelper = /** @class */ (function () {
    function OnChainHelper(provider, blocks, msBetweekBlockQuery) {
        this._AVG_STARKNET_MIN_PER_BLOCK = 1.5; // 1min30s
        this._STARKNET_BLOCKS_PER_DAY = Helper_1.Helper.MIN_PER_DAY / this.AVG_STARKNET_MIN_PER_BLOCK;
        this._provider = provider;
        this._EXECUTE_SELECTOR = (0, hash_1.getSelectorFromName)("__execute__");
        this._blocks = blocks || {};
        this._msBetweekBlockQuery = msBetweekBlockQuery || 0;
    }
    OnChainHelper.prototype.getYesterdayBlockRange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestBlockNumber, startBlockNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getLatestBlockNumber()];
                    case 1:
                        latestBlockNumber = _a.sent();
                        startBlockNumber = latestBlockNumber - this.STARKNET_BLOCKS_PER_DAY;
                        return [2 /*return*/, [startBlockNumber, latestBlockNumber]];
                }
            });
        });
    };
    OnChainHelper.prototype._getAllTransactionsWithinBlockRange = function (startBlockNumber, endBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var milestones, allTransactions, i, _block, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        milestones = Helper_1.Helper.getMilestones(startBlockNumber, endBlockNumber);
                        allTransactions = [];
                        i = startBlockNumber;
                        _a.label = 1;
                    case 1:
                        if (!(i <= endBlockNumber)) return [3 /*break*/, 4];
                        Helper_1.Helper.displayProgress(milestones, i, "fetching blocks");
                        return [4 /*yield*/, this.getBlock(i.toString())];
                    case 2:
                        _block = _a.sent();
                        block = Helper_1.Helper.forceCast(_block);
                        allTransactions.push.apply(allTransactions, block.transactions);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, allTransactions];
                }
            });
        });
    };
    OnChainHelper.prototype._getLatestBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getBlock("pending")];
                    case 1:
                        latestBlock = _a.sent();
                        if (isNaN(latestBlock.block_number)) {
                            throw new Error("OnChainHelper::_getLatestBlockNumber - latestBlockNumber is not a number (latestBlockNumber: " + latestBlock.block_number + ")");
                        }
                        return [2 /*return*/, latestBlock.block_number];
                }
            });
        });
    };
    OnChainHelper.prototype.getBlock = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var _block, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.blocks[blockNumber]) return [3 /*break*/, 1];
                        return [2 /*return*/, this.blocks[blockNumber]];
                    case 1: return [4 /*yield*/, this.provider.getBlock(blockNumber)];
                    case 2:
                        _block = _a.sent();
                        block = Helper_1.Helper.forceCast(_block);
                        this._blocks[blockNumber] = block;
                        return [4 /*yield*/, Helper_1.Helper.sleep(this._msBetweekBlockQuery)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, block];
                }
            });
        });
    };
    OnChainHelper.prototype._getContractsActivity = function (transactions) {
        var contractsActivity = {};
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var tx = transactions_1[_i];
            if (tx.type === "DEPLOY")
                continue;
            // const type = this._getContractType(tx);
            var amount = contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].transactionCount;
            var rawTransactions = void 0;
            if (contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].rawTransactions) {
                rawTransactions = __spreadArray(__spreadArray([], contractsActivity[tx.contract_address].rawTransactions, true), [tx], false);
            }
            else {
                rawTransactions = [tx];
            }
            contractsActivity[tx.contract_address] = {
                transactionCount: isNaN(amount) ? 1 : amount + 1,
                type: (contractsActivity[tx.contract_address] && contractsActivity[tx.contract_address].type === "ACCOUNT_CONTRACT") ? "ACCOUNT_CONTRACT" : this._getContractType(tx),
                rawTransactions: rawTransactions
            };
        }
        return contractsActivity;
    };
    OnChainHelper.prototype._getContractType = function (transaction) {
        // assuming accounts contract calls `__execute__`
        // other solution : calling `get_signer` for Argent Accounts or `get_public_key` for OpenZeppelin Accounts, but it is very long
        return transaction.entry_point_selector === this.EXECUTE_SELECTOR ? "ACCOUNT_CONTRACT" : "GENERAL_CONTRACT";
    };
    Object.defineProperty(OnChainHelper.prototype, "provider", {
        get: function () {
            return this._provider;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OnChainHelper.prototype, "blocks", {
        get: function () {
            return this._blocks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OnChainHelper.prototype, "EXECUTE_SELECTOR", {
        get: function () {
            return this._EXECUTE_SELECTOR;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OnChainHelper.prototype, "AVG_STARKNET_MIN_PER_BLOCK", {
        get: function () {
            return this._AVG_STARKNET_MIN_PER_BLOCK;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OnChainHelper.prototype, "STARKNET_BLOCKS_PER_DAY", {
        get: function () {
            return this._STARKNET_BLOCKS_PER_DAY;
        },
        enumerable: false,
        configurable: true
    });
    return OnChainHelper;
}());
exports.OnChainHelper = OnChainHelper;
