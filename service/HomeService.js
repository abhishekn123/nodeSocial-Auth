const queryString = require('querystring');
function Home(req, res) {
    res.render("HomeView", { googleUrl: BuildGoogleUrl(), facebookUrl:BuildFacebookUrl() });
}
function BuildGoogleUrl() {
    const stringifiedParams = queryString.stringify({
        client_id: "641377098898-0n2cqjeie4prfel4thp6oha7dgmrojth.apps.googleusercontent.com",
        redirect_uri: "http://localhost:5500/google",
        scope: process.env.GOOGLESCOPE,
        response_type: 'code',
        prompt: 'consent',
        nonce: 'n-0S6_WzA2Mj'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
}

function BuildFacebookUrl() {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.FACEBOOK_APPID,
        redirect_uri: 'http://localhost:5500/facebook',
        scope: ['email', 'user_friends'].join(','),
        response_type: 'code',
        auth_type: 'rerequest',
        display: 'popup',
    });

    return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
}

module.exports = Home;