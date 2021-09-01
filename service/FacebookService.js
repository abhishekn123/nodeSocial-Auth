const { default: axios } = require('axios');
const request = require('request');
const { createToken } = require('../middlewares/signature');
function LoginWithFacebook(req, response) {
    var postDataUrl = 'https://graph.facebook.com/v4.0/oauth/access_token?' +
        'code=' + req.query.code +
        '&client_id=' + process.env.FACEBOOK_APPID +
        '&client_secret=' + process.env.FACEBOOK_APPSECRET +
        '&redirect_uri=' + process.env.FACEBOOKREDIRECT_URI +
        '&grant_type=' + "authorization_code"
    var options = {
        uri: postDataUrl,
        method: 'GET'
    };
    request(options, function (err, res, body) {
        let data = JSON.parse(body);
        getFacebookUserData(data.access_token).then(data => {
            let token = createToken(data)
            response.cookie('session-token', token);
            response.redirect("/facebookProfile");
        }).catch(err => {
            console.log(err);
        })
    });
}

async function getFacebookUserData(access_token) {
    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'first_name', 'last_name'].join(','),
            access_token: access_token,
        },
    });
    return data;
};
function parseJwt(base64Url) {
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
function atob(a) {
    return new Buffer(a, 'base64').toString('binary');
};
module.exports = LoginWithFacebook