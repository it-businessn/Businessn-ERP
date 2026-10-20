// Test-only environment. These are deliberately fake values so the app can be
// imported without a real .env; nothing here grants access to any live system.
process.env.NODE_ENV = "test";
process.env.PORT = "0";
process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.DB_CONNECTION_URL_STAGING_CRM = "mongodb://127.0.0.1:27017/erp-test";
process.env.BASE_URL_LIVE = "http://localhost:0";
process.env.SIN_ENCRYPTION_KEY = "00".repeat(32);
process.env.BANKING_ENCRYPTION_KEY = "11".repeat(32);
process.env.XML_ENCRYPTION_KEY = "22".repeat(32);
for (const k of [
	"VOPAY_PARTNER_ACCOUNT_ID","VOPAY_API_KEY_PROD","VOPAY_SHARED_SECRET_PROD",
	"VOPAY_API_KEY_STAGING","VOPAY_SHARED_SECRET_STAGING","VOPAY_BASE_URL_STAGING",
	"VOPAY_PARTNER_ACCOUNT_ID_PROD_TEST","VOPAY_API_KEY_PROD_TEST","VOPAY_BASE_URL_PROD",
	"VOPAY_SHARED_SECRET_PROD_TEST","TECHCORP_ACCOUNT_ID","TECHCORP_SHARED_KEY",
	"TECHCORP_SHARED_SECRET","CORNERSTONE_ACCOUNT_ID","CORNERSTONE_SHARED_KEY",
	"CORNERSTONE_SHARED_SECRET","CORNERSTONE_CLIENTACCOUNTID",
	"NODEMAILER_ZOHO_SMTP","NODEMAILER_ZOHO_SMTP_PORT",
	"NODEMAILER_ZOHO_SMTP_SUPPORT_EMAIL_ADMIN","NODEMAILER_ZOHO_SMTP_SUPPORT_PASSWORD_ADMIN",
]) process.env[k] = process.env[k] || `test-${k.toLowerCase()}`;
process.env.VOPAY_BASE_URL_STAGING = "http://vopay.invalid/";
process.env.VOPAY_BASE_URL_PROD = "http://vopay.invalid/";
process.env.NODEMAILER_ZOHO_SMTP_PORT = "465";
