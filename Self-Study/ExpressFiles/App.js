const express = require("express");
require("dotenv").config();
const path = require("path")

const App = express();
App.use(express.static(path.join(__dirname, "public")));
App.set("view engine", "ejs");
App.use(express.static(path.join(__dirname, "views")));
// Navigate to home page

App.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/home.html"));
});

//Navigate to about Us page
App.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/about.html"));
});

App.get('/gretting', (req, res) => {
    res.render("message", {message : "Hello client"})
});

const PORT = process.env.PORT || 3001;
App.listen(PORT, () => console.log(`http://localhost:${PORT}`))