const crypto = require('crypto');
const fs = require('fs');
const {Buffer} = require('buffer')
const { verifyToken } = require('./signature');
function CheckGoogleAuthentication(req, res, next) {
    const token = req.cookies['session-token']
    if(!token){res.status(400).send("Bad Request")}
    let parts = token.split(".")
    let payload = parseJwt(parts[1]);
    if (verifyToken(token)) {
        req.body = { name: payload.name, url: payload.url }
        return next();
    } else {
        res.status(400).send("Invalid Token")
    }
    res.status(400).send("UnAuthorized");
}

function CheckFacebookAuthentication(req, res, next) {
    const token = req.cookies['session-token']
    if(!token){res.status(400).send("Bad Request")}
    let parts = token.split(".")
    let payload = parseJwt(parts[1]);
    if (verifyToken(token)) {
        req.body = { name: payload.first_name, url: "" }
        return next();
    } else {
        res.status(400).send("Invalid Token")
    }
    res.status(400).send("UnAuthorized");
}

function parseJwt(base64Url) {
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};


function atob(a) {
    return  Buffer.from(a, 'base64').toString('binary');
};


function genKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1', 
            format: 'pem' 
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' 
        }
    });
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}
module.exports = { CheckGoogleAuthentication, CheckFacebookAuthentication }