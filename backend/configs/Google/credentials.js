'use strict';
require('dotenv').config();
const google = require('@googleapis/sheets');

const { TYPE_GG_SHEET, PROJECT_ID_GG_SHEET, PRIVATE_KEY_ID_GG_SHEET, PRIVATE_KEY_GG_SHEET, CLIENT_EMAIL_GG_SHEET, CLIENT_ID_GG_SHEET, AUTH_URI_GG_SHEET, TOKEN_URI_GG_SHEET, AUTH_PROVIDER_X509_CERT_URL_GG_SHEET, CLIENT_X509_CERT_URL_GG_SHEET, UNIVERSE_DOMAIN_GG_SHEET } = process.env;

const credentials = {
    type: TYPE_GG_SHEET,
    project_id: PROJECT_ID_GG_SHEET,
    private_key_id: PRIVATE_KEY_ID_GG_SHEET,
    private_key: PRIVATE_KEY_GG_SHEET,
    client_email: CLIENT_EMAIL_GG_SHEET,
    client_id: CLIENT_ID_GG_SHEET,
    auth_uri: AUTH_URI_GG_SHEET,
    token_uri: TOKEN_URI_GG_SHEET,
    auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL_GG_SHEET,
    client_x509_cert_url: CLIENT_X509_CERT_URL_GG_SHEET,
    universe_domain: UNIVERSE_DOMAIN_GG_SHEET
};

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = new google.sheets_v4.Sheets({
    auth,
});

module.exports = { auth, sheets };
