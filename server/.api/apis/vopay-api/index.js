"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'vopay-api/2.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * This endpoint is used to create a VoPay account. You will need to sign-up as a partner
     * account in order to use this endpoint and start creating VoPay accounts for your users.
     *
     * @summary partner/account
     */
    SDK.prototype.accountPOST = function (body) {
        return this.core.fetch('/partner/account', 'post', body);
    };
    /**
     * This endpoint is used to get a list of accounts created using a partner account. It will
     * return the accounts data including shareholder, signing authority and balance
     * information
     *
     * @summary partner/account
     */
    SDK.prototype.accountGET = function (metadata) {
        return this.core.fetch('/partner/account', 'get', metadata);
    };
    /**
     * This endpoint is used to provide the use cases for the VoPay account you are onboarding.
     *
     * @summary partner/account/business-case
     */
    SDK.prototype.accountBusinessCasePOST = function (body) {
        return this.core.fetch('/partner/account/business-case', 'post', body);
    };
    /**
     * This endpoint will allow a partner to modify the permissions and the maximum amounts for
     * their accounts.
     *
     * @summary partner/account/set-permissions
     */
    SDK.prototype.accountSetPermissionsPOST = function (body) {
        return this.core.fetch('/partner/account/set-permissions', 'post', body);
    };
    /**
     * This endpoint is used to retrieve the list of billing packages that you can assign to an
     * account.
     *
     * @summary partner/billing-packages
     */
    SDK.prototype.partnerBillingPackagesGET = function (metadata) {
        return this.core.fetch('/partner/billing-packages', 'get', metadata);
    };
    /**
     * This endpoint is used to retrieve the invoice-details (number of transactions, rates,
     * etc) for a given billing cycle. If no month/year is provided, the current month/year is
     * used.
     *
     * @summary partner/invoice-details
     */
    SDK.prototype.partnerInvoiceDetailsGET = function (metadata) {
        return this.core.fetch('/partner/invoice-details', 'get', metadata);
    };
    /**
     * This endpoint is used to fetch all the transactions belonging to your accounts
     *
     * @summary partner/account/transactions
     */
    SDK.prototype.partnerAccountTransactionsURLGET = function (metadata) {
        return this.core.fetch('/partner/account/transactions', 'get', metadata);
    };
    /**
     * This endpoint allows you to transfer funds between VoPay accounts.
     *
     * @summary partner/account/transfer
     */
    SDK.prototype.partnerAccountTransferPost = function (body) {
        return this.core.fetch('/partner/account/transfer', 'post', body);
    };
    /**
     * This endpoint will fund the Debitor account using their default bank account, and then
     * trigger an account transfer to the recipient account once the funds have been cleared.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary partner/account/fund-transfer
     */
    SDK.prototype.partnerAccountFundTransferPost = function (body) {
        return this.core.fetch('/partner/account/fund-transfer', 'post', body);
    };
    /**
     * This endpoint will transfer money from the debitor account to the recipient account, and
     * then immediately withdraw the money from the recipient account into their default bank
     * account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary partner/account/transfer-withdraw
     */
    SDK.prototype.partnerAccountTransferWithdrawPost = function (body) {
        return this.core.fetch('/partner/account/transfer-withdraw', 'post', body);
    };
    /**
     * This endpoint will fund the debitor account using their default bank account, and then
     * transfer the money to the recipient account once the funds have been cleared. Once the
     * funds are transferred, a withdraw transaction will be triggered to send the funds to the
     * recipient account's default bank account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary partner/account/fund-transfer-withdraw
     */
    SDK.prototype.partnerAccountFundTransferWithdrawPost = function (body) {
        return this.core.fetch('/partner/account/fund-transfer-withdraw', 'post', body);
    };
    /**
     * This endpoint is used to fetch the onboarding URL for an account in the Application
     * Pending stage
     *
     * @summary partner/account/onboarding-url
     */
    SDK.prototype.partnerAccountOnboardingURLGET = function (metadata) {
        return this.core.fetch('/partner/account/onboarding-url', 'get', metadata);
    };
    /**
     * This endpoint returns details on your current account balance and available funds.
     *
     * @summary account/balance
     */
    SDK.prototype.accountBalanceGet = function (metadata) {
        return this.core.fetch('/account/balance', 'get', metadata);
    };
    /**
     * This endpoint will fund your VoPay account by debiting your default bank account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary account/fund-my-account
     */
    SDK.prototype.accountFundMyAccountPOST = function (body) {
        return this.core.fetch('/account/fund-my-account', 'post', body);
    };
    /**
     * This endpoint will create a scheduled transaction to fund your VoPay account by debiting
     * your default bank account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary account/fund-my-account/schedule
     */
    SDK.prototype.accountFundMyAccountSchedulePOST = function (body) {
        return this.core.fetch('/account/fund-my-account/schedule', 'post', body);
    };
    /**
     * This endpoint will credit your default bank account by withdarwing funds from your VoPay
     * account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary account/withdraw-my-account
     */
    SDK.prototype.accountWithdrawMyAccountPOST = function (body) {
        return this.core.fetch('/account/withdraw-my-account', 'post', body);
    };
    /**
     * This endpoint will create a scheduled transaction to credit your default bank account by
     * withdarwing funds from your VoPay account.
     *
     * To set a default bank account, please use the /bank-account/set-my-bank-account
     * endpoint.
     *
     * @summary account/withdraw-my-account/schedule
     */
    SDK.prototype.accountWithdrawMyAccountSchedulePOST = function (body) {
        return this.core.fetch('/account/withdraw-my-account/schedule', 'post', body);
    };
    /**
     * This endpoint returns a list all of the transactions which affect the account balance.
     * This endpoint only returns basic information on the transactions. More detailed
     * information on individual transactions is available from other API endpoints.
     *
     * @summary account/transactions
     */
    SDK.prototype.accountTransactionsGet = function (metadata) {
        return this.core.fetch('/account/transactions', 'get', metadata);
    };
    /**
     * This endpoint returns a list all of transaction codes that can be assigned to
     * transactions.
     *
     * @summary account/transactions/codes
     */
    SDK.prototype.accountTransactionsCodesGet = function (metadata) {
        return this.core.fetch('/account/transactions/codes', 'get', metadata);
    };
    /**
     * This endpoint returns a list all of your GL codes that can be assigned to transactions.
     * Note, you must connect your accounting software to your account in order to use this
     * endpoint.
     *
     * @summary account/transactions/gl-codes
     */
    SDK.prototype.accountTransactionsGLCodesGet = function (metadata) {
        return this.core.fetch('/account/transactions/gl-codes', 'get', metadata);
    };
    /**
     * This endpoint returns the remaining daily, weekly and monthly transaction limits for
     * your VoPay account. If not limits are currently set for your VoPay account, N/A will be
     * returned for each.
     *
     * @summary account/remaining-limit
     */
    SDK.prototype.accountRemainingLimitGet = function (metadata) {
        return this.core.fetch('/account/remaining-limit', 'get', metadata);
    };
    /**
     * This endpoint allows you to transfer funds between VoPay accounts and/or Client
     * accounts.
     *
     * @summary account/transfer-to
     */
    SDK.prototype.accountTransferToPost = function (body) {
        return this.core.fetch('/account/transfer-to', 'post', body);
    };
    /**
     * This endpoint allows you to transfer funds from a pre-authorized VoPay account to your
     * VoPay or client account.
     *
     * @summary account/transfer-from
     */
    SDK.prototype.accountTransferFromPost = function (body) {
        return this.core.fetch('/account/transfer-from', 'post', body);
    };
    /**
     * This endpoint allows you to set up an auto-balance transfer from your VoPay account to
     * your default operational bank account. The frequency available to set the auto-transfer
     * can be daily, weekly, bi-weekly or monthly.
     *
     * This option requires special permission.
     *
     * @summary account/auto-balance-transfer
     */
    SDK.prototype.accountAutoBalanceTransferPOST = function (body) {
        return this.core.fetch('/account/auto-balance-transfer', 'post', body);
    };
    /**
     * This endpoint is used to retrieve the information of your auto balance transfer.
     *
     *  This option requires special permissions.
     *
     * @summary account/auto-balance-transfer
     */
    SDK.prototype.accountAutoBalanceTransferGET = function (metadata) {
        return this.core.fetch('/account/auto-balance-transfer', 'get', metadata);
    };
    /**
     * This endpoint returns a list of recent transactions for a specific contact or client
     * account.
     *
     * @summary account/transactions/recent
     */
    SDK.prototype.accountTransactionsRecentGet = function (metadata) {
        return this.core.fetch('/account/transactions/recent', 'get', metadata);
    };
    /**
     * This endpoint is used to retrieve a list of all your auto balance transfers.
     *
     *  This option requires special permissions.
     *
     * @summary account/auto-balance-transfer-list
     */
    SDK.prototype.accountAutoBalanceTransferListGET = function (metadata) {
        return this.core.fetch('/account/auto-balance-transfer-list', 'get', metadata);
    };
    /**
     * This endpoint allows you to cancel an auto balance transfer.
     *
     *  This option requires special permissions.
     *
     * @summary account/auto-balance-transfer/cancel
     */
    SDK.prototype.accountAutoBalanceTransferCancelPOST = function (body) {
        return this.core.fetch('/account/auto-balance-transfer/cancel', 'post', body);
    };
    /**
     * This endpoint returns the list of transactions associated with an auto balance transfer.
     *
     *
     * The sum of all debits/credits should match the amount on the auto-balance transfer.
     *
     * @summary account/auto-balance-transfer/report
     */
    SDK.prototype.accountAutoBalanceTransferReportGET = function (metadata) {
        return this.core.fetch('/account/auto-balance-transfer/report', 'get', metadata);
    };
    /**
     * This endpoint allows an account's authorized IP addresses to be updated. As updating the
     * authorized IP addresses will overwrite the existing list, GET the list prior to issuing
     * a POST if you wish to append a value.
     *
     * @summary account/authorized-ips
     */
    SDK.prototype.accountAuthorizedIPsPOST = function (body) {
        return this.core.fetch('/account/authorized-ips', 'post', body);
    };
    /**
     * This endpoint retrieves an account's authorized IP addresses.
     *
     * @summary account/authorized-ips
     */
    SDK.prototype.accountAuthorizedIPsGET = function (metadata) {
        return this.core.fetch('/account/authorized-ips', 'get', metadata);
    };
    /**
     * This endpoint allows you to set your account's default payment method. This payment
     * method will be used when collecting money for you monthly invoice. The default payment
     * method is your VoPay account.
     *
     * @summary account/set-default-payment-method
     */
    SDK.prototype.accountSetDefaultPaymentMethodPOST = function (body) {
        return this.core.fetch('/account/set-default-payment-method', 'post', body);
    };
    /**
     * Retrieves the history for a specific transaction.
     *
     * @summary account/transaction/history
     */
    SDK.prototype.accountTransactionHistoryPost = function (body, metadata) {
        return this.core.fetch('/account/transaction/history', 'post', body, metadata);
    };
    /**
     * This endpoint is used to create a new sub-account.
     *
     * @summary account/subaccount
     */
    SDK.prototype.subaccountPOST = function (body) {
        return this.core.fetch('/account/subaccount', 'post', body);
    };
    /**
     * This endpoint will return a list of all of the sub-accounts managed by the main account.
     *
     * @summary account/subaccount
     */
    SDK.prototype.subaccountGET = function (metadata) {
        return this.core.fetch('/account/subaccount', 'get', metadata);
    };
    /**
     * This endpoint will return a list of all of the transactions for sub-accounts, and its
     * sub-accounts transaction.
     *
     * @summary account/subaccount/transactions
     */
    SDK.prototype.subaccountTransactionGET = function (metadata) {
        return this.core.fetch('/account/subaccount/transactions', 'get', metadata);
    };
    /**
     * This endpoint will allow the user to modify the permissions and the maximum amounts to
     * their sub-accounts in the API.
     *
     *  The main account will be able to only modify the permission that he has, For Example,
     * if the user does not have ETCCollect permission, the account won't be able to assign
     * that permission to their sub-account.
     *
     * @summary account/subaccount/set-permissions
     */
    SDK.prototype.subaccountSetPermissionsPOST = function (body) {
        return this.core.fetch('/account/subaccount/set-permissions', 'post', body);
    };
    /**
     * This endpoint will allow the user to resend an application to the sub-account. The
     * sub-account must be in Application Pending status for the applicattion to be sent.
     *
     * @summary account/subaccount/send-onboarding-application
     */
    SDK.prototype.subaccountSendOnboardingApplicationPOST = function (body) {
        return this.core.fetch('/account/subaccount/send-onboarding-application', 'post', body);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
