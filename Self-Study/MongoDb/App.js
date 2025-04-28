const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./userRoute.js");
const path = require("path");
require("dotenv").config();
const session = require("express-session");

const App = express();
App.use(bodyParser.json());
App.use(express.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.set(express.static(path.join(__dirname, "view")));

App.use(session({
    secret: 'factorise',
   resave: false,
   saveUninitialized: true,
}));

App.use((req, res, next) => {
    res.locals.successMsg = req.session.successMsg; // enable message to displaye in ejs
    res.locals.errorMsg = req.session.errorMsg; // also this
    delete successMsg; // delete message in session after display it
    delete errorMsg; // also this
    next(); // allow user to move to the next page
});
App.use("/user", userRoute);
// if user typed login instead of user/login
App.get('/login', (req, res) => {
    res.redirect('/user/login');
})
const URL = process.env.CONNECTION_STRING;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected Successfully");
}).catch((err) => {
    console.error("Error in database connection", err);
});

const PORT = process.env.PORT
App.listen(PORT, () => console.log(`http://localhost:${PORT}`));