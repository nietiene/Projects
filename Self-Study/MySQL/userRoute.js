const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

const connection = mysql.createConnection({
    host:process.env.HOST_NAME,
    user:process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});

// database connection
connection.connect((err) => {
    if (err) {
      throw err;   
    } else {
        console.log("Databse connected");
    }
});

router.get('/', (req, res) => {
    res.send("Welcome to Backend side of app");
})
//insert data in database

router.get('/add', (req, res) => {
    res.render("insert");
});

router.post('/add', (req, res) => {

    const {name, place} = req.body;
    const sqlQuery = "INSERT INTO self(name, place) VALUES(?, ?)";
    connection.query(sqlQuery, [name, place], (err) => {
        if (err) {
             throw err;
        } else {
            res.status(200).redirect("/user");
        }
    });
});

// Retieve data

router.get('/user', (req, res) => {

    const sql =  "SELECT * FROM self";
    connection.query(sql,  (err, data) => {
        if (err) {
            throw err;
        } else {
            res.status(200).render("user", {user: data});
        }
    });
})

// update 
router.get('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const slqUpdate = "SELECT * FROM self WHERE id = ?";
    connection.query(slqUpdate, id, (err, data) => {
        if (err) {
            res.status(404).send("User not found");
        }  else {
            res.render("update", {user: data[0]});
        }
    });

});

router.post('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {name, place} = req.body;
    const sqlUpdate = `UPDATE self SET name = ?, place = ? WHERE id = ${id}`;
    connection.query(sqlUpdate, [name, place], (err, user) => {
        if (err) {
            throw err;
        } else {
            res.status(200).redirect('/user');
        }
    })
})
// delete 
router.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sqlDelete = `DELETE FROM self WHERE id = ${id}`;
    connection.query(sqlDelete, (err) => {
        if (err) {
            throw err;
        } else {
            res.status(200).redirect('/user');
        }
    });
})
module.exports = router;