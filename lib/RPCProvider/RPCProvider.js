"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCProvider = void 0;
var client_js_1 = require("@open-rpc/client-js");
var hash_1 = require("starknet/utils/hash");
var RPCProvider = /** @class */ (function () {
    function RPCProvider(baseUrl) {
        this._transport = new client_js_1.HTTPTransport(baseUrl);
        this._client = new client_js_1.Client(new client_js_1.RequestManager([this._transport]));
        this._baseUrl = baseUrl;
        this._gatewayUrl = baseUrl + "/gateway";
        this._feederGatewayUrl = baseUrl + "/feeder_gateway";
    }
    RPCProvider.prototype.request = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.request({
                            method: method,
                            params: params
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RPCProvider.prototype.getContractAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::getContractAddresses - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.getStorageAt = function (contractAddress, key, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::getStorageAt - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.callContract = function (invokeTransaction, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("starknet_call", [{
                                contract_address: invokeTransaction.contractAddress,
                                entry_point_selector: (0, hash_1.getSelectorFromName)(invokeTransaction.entrypoint),
                                calldata: invokeTransaction.calldata || []
                            }, options.blockIdentifier /* blockHash */])];
                    case 1:
                        _res = _a.sent();
                        return [2 /*return*/, { result: _res }];
                }
            });
        });
    };
    RPCProvider.prototype.getLatestBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("starknet_blockNumber", [])];
            });
        });
    };
    RPCProvider.prototype.getTransactionStatus = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::getTransactionStatus - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.getTransactionReceipt = function (_a) {
        var txHash = _a.txHash, txId = _a.txId;
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.request("starknet_getTransactionReceipt", [txHash])];
                    case 1:
                        receipt = _b.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    RPCProvider.prototype.getBlock = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var _blockNumber, _block, transactions, transaction_receipts, _i, _a, txHash, tx, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(blockNumber === "pending")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLatestBlockNumber()];
                    case 1:
                        _blockNumber = (_b.sent()) - 1;
                        return [3 /*break*/, 3];
                    case 2:
                        _blockNumber = +blockNumber;
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.request("starknet_getBlockByNumber", [_blockNumber])];
                    case 4:
                        _block = _b.sent();
                        transactions = [];
                        transaction_receipts = [];
                        _i = 0, _a = _block.transactions;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        txHash = _a[_i];
                        return [4 /*yield*/, this.getTransaction(txHash)];
                    case 6:
                        tx = _b.sent();
                        return [4 /*yield*/, this.getTransactionReceipt({ txHash: txHash })];
                    case 7:
                        receipt = _b.sent();
                        transactions.push(tx);
                        transaction_receipts.push(receipt);
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 5];
                    case 9: return [2 /*return*/, __assign(__assign({}, _block), { transactions: transactions, transaction_receipts: transaction_receipts })];
                }
            });
        });
    };
    // async getTransactionReceipt(txHash: BigNumberish) {
    // const receipt = await this.request("starknet_getTransactionReceipt", [txHash]);
    // return receipt;
    // }
    RPCProvider.prototype.getTransaction = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("starknet_getTransactionByHash", [txHash])];
                    case 1:
                        transaction = _a.sent();
                        transaction.transaction_hash = transaction.txn_hash;
                        delete transaction.txn_hash;
                        return [2 /*return*/, transaction];
                }
            });
        });
    };
    ;
    // async getTransactionTrace() {
    // throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
    // }
    RPCProvider.prototype.getTransactionTrace = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.getCode = function (contractAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bytecode, _abi;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.request("starknet_getCode", [contractAddress])];
                    case 1:
                        _a = _b.sent(), bytecode = _a.bytecode, _abi = _a.abi;
                        return [2 /*return*/, { bytecode: bytecode, abi: JSON.parse(_abi) }];
                }
            });
        });
    };
    // async callContract({
    //     contractAddress,
    //     entrypoint,
    //     calldata
    // }: { contractAddress: string, entrypoint: string, calldata?: any }, _blockHash?: string) {
    //     let blockHash = _blockHash;
    //     if(!blockHash) {
    //         const lastBlockNumber = await this.getLatestBlockNumber();
    //         blockHash = (await this.getBlock(lastBlockNumber)).block_hash;
    //     }
    //     const _res = await this.request("starknet_call", [{
    //         contract_address: contractAddress,
    //         entry_point_selector: getSelectorFromName(entrypoint),
    //         calldata: calldata || []
    //     }, blockHash]);
    //     return { result: _res };
    // }
    RPCProvider.prototype.deployContract = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::deployContract - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.invokeFunction = function (invocation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::invokeFunction - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.waitForTransaction = function (txHash, retryInterval) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::waitForTransaction - Function not implemented yet");
            });
        });
    };
    RPCProvider.prototype.waitForTx = function (txHash, retryInterval) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("RPCProvider::waitForTx - Deprecated, use waitForTransaction instead");
            });
        });
    };
    Object.defineProperty(RPCProvider.prototype, "baseUrl", {
        get: function () {
            return this._baseUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RPCProvider.prototype, "gatewayUrl", {
        get: function () {
            return this._gatewayUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RPCProvider.prototype, "feederGatewayUrl", {
        get: function () {
            return this._feederGatewayUrl;
        },
        enumerable: false,
        configurable: true
    });
    return RPCProvider;
}());
exports.RPCProvider = RPCProvider;
