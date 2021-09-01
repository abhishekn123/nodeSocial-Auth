const express = require('express');
const LoginWithFacebook = require('./service/FacebookService');
const LoginWithGoogle = require('./service/GoogleService');
const Home = require("./service/HomeService");
const app = express();
const ejs = require('ejs');
const { CheckFacebookAuthentication, CheckGoogleAuthentication } = require("./middlewares/AuthMiddleware");
const cookieParser = require('cookie-parser')
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(express.json({
    type: ['application/json', 'text/plain']
}))

app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.get("/", Home)
app.get("/google", LoginWithGoogle);
app.get("/facebook", LoginWithFacebook)
app.get("/googleProfile", CheckGoogleAuthentication, (req, res) => {
    res.render("ProfileView", { name: req.body.name, url: req.body.url });
})
app.get("/facebookProfile", CheckFacebookAuthentication, (req, res) => {
    res.render("ProfileView", { name: req.body.name, url: req.body.url });
})
app.listen(process.env.PORT, () => {
    console.log(`Server listening at Port ${process.env.PORT}`);
})
