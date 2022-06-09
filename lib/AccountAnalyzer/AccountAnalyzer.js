"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AccountAnalyzer = void 0;
var OnChainHelper_1 = require("./OnChainHelper");
var TransactionCallOrganizer_1 = require("starknet-analyzer/lib/organizers/TransactionCallOrganizer");
var AccountAnalyzer = /** @class */ (function (_super) {
    __extends(AccountAnalyzer, _super);
    function AccountAnalyzer(provider, blocks, msBetweenBlockQuery) {
        var _this = _super.call(this, provider, blocks, msBetweenBlockQuery) || this;
        _this._sortedContractsActivity = {};
        _this._organizedAccountsActivity = {};
        return _this;
    }
    AccountAnalyzer.prototype.getTopAccountsFromBlockNumbers = function (startBlockNumber, endBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var allTransactions, contractsActivity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\nStarting at " + startBlockNumber + " and ending at " + endBlockNumber + " (" + (endBlockNumber - startBlockNumber) + " blocks total)");
                        return [4 /*yield*/, _super.prototype._getAllTransactionsWithinBlockRange.call(this, startBlockNumber, endBlockNumber)];
                    case 1:
                        allTransactions = _a.sent();
                        contractsActivity = _super.prototype._getContractsActivity.call(this, allTransactions);
                        this._sortedContractsActivity = this._sortContractsPerActivity(contractsActivity);
                        console.log("Done getting top accounts.");
                        return [2 /*return*/, this];
                }
            });
        });
    };
    AccountAnalyzer.prototype.organizeTransactionsForAccounts = function (amount, _sortedAccountsActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var sortedContractsActivity, organizedSortedAccountsActivity, transactionCallOrganizer, i, _a, _b, _i, key, organizedTransactions;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sortedContractsActivity = this._getSortedContractsActivity(_sortedAccountsActivity);
                        organizedSortedAccountsActivity = {};
                        transactionCallOrganizer = new TransactionCallOrganizer_1.TransactionCallOrganizer(this.provider);
                        i = 0;
                        _a = [];
                        for (_b in sortedContractsActivity)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        if (sortedContractsActivity[key].type === "GENERAL_CONTRACT")
                            return [3 /*break*/, 3];
                        if (i >= amount)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.organizeTransactionsForAccount(sortedContractsActivity[key], transactionCallOrganizer)];
                    case 2:
                        organizedTransactions = _c.sent();
                        organizedSortedAccountsActivity[key] = __assign(__assign({}, sortedContractsActivity[key]), { organizedTransactions: organizedTransactions });
                        i++;
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this._organizedAccountsActivity = organizedSortedAccountsActivity;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    AccountAnalyzer.prototype.organizeTransactionsForAccount = function (account, _transactionCallOrganizer) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionCallOrganizer, organizedTx, _i, _a, tx, _organizedFunctionCalls, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactionCallOrganizer = _transactionCallOrganizer ? _transactionCallOrganizer : new TransactionCallOrganizer_1.TransactionCallOrganizer(this.provider);
                        organizedTx = [];
                        _i = 0, _a = account.rawTransactions;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        tx = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, transactionCallOrganizer.getCalldataPerCallFromTx(tx)];
                    case 3:
                        _organizedFunctionCalls = _b.sent();
                        if (_organizedFunctionCalls) {
                            organizedTx.push({
                                transactionHash: tx.transaction_hash,
                                organizedFunctionCalls: _organizedFunctionCalls
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.log("error with tx " + tx.transaction_hash);
                        console.log(error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, organizedTx];
                }
            });
        });
    };
    AccountAnalyzer.prototype._sortContractsPerActivity = function (contractInteractions) {
        var sortedContractsArray = Object.entries(contractInteractions).sort(function (_a, _b) {
            var amountA = _a[1];
            var amountB = _b[1];
            return amountB.transactionCount - amountA.transactionCount;
        });
        var sortedContractsObject = {};
        for (var _i = 0, sortedContractsArray_1 = sortedContractsArray; _i < sortedContractsArray_1.length; _i++) {
            var _a = sortedContractsArray_1[_i], addr = _a[0], contractObject = _a[1];
            sortedContractsObject[addr] = contractObject;
        }
        return sortedContractsObject;
    };
    AccountAnalyzer.prototype._getSortedContractsActivity = function (_sortedContractsActivity) {
        return _sortedContractsActivity ? _sortedContractsActivity : this.sortedContractsActivity;
    };
    Object.defineProperty(AccountAnalyzer.prototype, "sortedContractsActivity", {
        get: function () {
            return this._sortedContractsActivity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AccountAnalyzer.prototype, "organizedAccountsActivity", {
        get: function () {
            return this._organizedAccountsActivity;
        },
        enumerable: false,
        configurable: true
    });
    return AccountAnalyzer;
}(OnChainHelper_1.OnChainHelper));
exports.AccountAnalyzer = AccountAnalyzer;
