const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser")
const path = require("path");
const user = require("./userRoute.js");

const App = express();
App.use(bodyParser.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.set(express.static(path.join(__dirname, "views")));
App.use('/', user);

const PORT = process.env.PORT;
App.listen(PORT, () => console.log(`http://localhost:${PORT}`));