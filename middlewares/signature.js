const base64 = require('base64url');
const crypto = require('crypto');


const fs = require('fs');

function createToken(payload = { }) {
    const signatureFunction = crypto.createSign('RSA-SHA256');
    const headerObj = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const payloadObj = {
        sub: '1234567890',
        admin: true,
        iat: 1516239022,
        ...payload
    };

    const headerObjString = JSON.stringify(headerObj);
    const payloadObjString = JSON.stringify(payloadObj);

    const base64UrlHeader = base64(headerObjString);
    const base64UrlPayload = base64(payloadObjString);

    signatureFunction.write(base64UrlHeader + '.' + base64UrlPayload);
    const PRIV_KEY = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');
    signatureFunction.end();

    const signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');
    const signatureBase64Url = base64.fromBase64(signatureBase64);

    return base64UrlHeader + "." + base64UrlPayload + "." + signatureBase64Url;
}
function verifyToken(token) {
    const verifyFunction = crypto.createVerify('RSA-SHA256');
    const PUB_KEY = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');
    const jwtHeader = token.split('.')[0];
    const jwtPayload = token.split('.')[1];
    const jwtSignature = token.split('.')[2];
    verifyFunction.write(jwtHeader + '.' + jwtPayload);
    const jwtSignatureBase64 = base64.toBase64(jwtSignature);
    verifyFunction.end();
    return verifyFunction.verify(PUB_KEY, jwtSignatureBase64, 'base64')
}
module.exports = { createToken, verifyToken }