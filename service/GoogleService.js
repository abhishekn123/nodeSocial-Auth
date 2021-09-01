const request = require('request');
const { Buffer } = require('buffer')
const { createToken } = require('../middlewares/signature');
function LoginWithGoogle(req, response) {
    var postDataUrl = 'https://www.googleapis.com/oauth2/v4/token?' +
        'code=' + req.query.code +
        '&client_id=' + process.env.GOOGLECLIENT_ID +
        '&client_secret=' + process.env.GOOGLECLIENT_SECRET +
        '&redirect_uri=' + process.env.GOOGLEREDIRECT_URI +
        '&grant_type=' + "authorization_code"

    var options = {
        uri: postDataUrl,
        method: 'POST'
    };

    request(options, function (err, res, body) {
        let data = JSON.parse(body);
        let decoded = parseJwt(data.id_token.split(".")[1]);
        let token = createToken({ name: decoded.name, url: decoded.picture })
        response.cookie('session-token', token);
        response.redirect("/googleProfile");
    });
}
function parseJwt(base64Url) {
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function atob(a) {
    return new Buffer.from(a, 'base64').toString('binary');
};
module.exports = LoginWithGoogle