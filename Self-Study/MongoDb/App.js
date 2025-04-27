const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./userRoute");
const path = require("path");
require("dotenv").config();

const App = express();
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.use("/user", userRoute);
App.set(express.static(path.join(__dirname, "view")));

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