const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const session = require("express-session");

// Initialize session middleware
router.use(session({
    secret: 'factorise@123', // Your secret key can be random
    resave: false, // avoid to save every action
    saveUninitialized: true, // save only empty or new action
    cookie: {secure: false} // when using hhtp we set false
}));

const connection = mysql.createConnection({
    host:process.env.HOST_NAME,
    user:process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});

//Check Authorised User
router.use((req, res, next) => {
    res.set('Cache-control', 'no-store');
    next();
})
const Authorised = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Show login page
router.get('/login', (req, res) => {
    res.render("login", {error: null}) // null means allow every user to access login page 
});

router.post('/login', (req, res) => {

    const {name, place} = req.body; // get credential from the user
    const sql = "SELECT * FROM self WHERE name = ? AND place = ?";
    connection.query(sql, [name, place], (err, result) => {
        if (err) {
            // throw err;
            console.log(err);
            return res.render('login', {error: 'Database Error'});
        }
        if (result.length > 0) {
             req.session.isLoggedIn = true;
             req.session.name = name;
             res.redirect("/user");
        } else {
            return res.render('login', {error: 'invalid name or place'});
        }
    } )
});

/// Create account
router.get('/register', (req, res) => {
    res.render('register', {errors: null});
});

router.post('/register', (req, res) => {
    const {name, place} = req.body;
   const sql = "INSERT INTO self(name, place) VALUES(?, ?)";
   connection.query(sql, [name, place], (err) => {
    if (err) {
        res.render("register", {errors: "Database Error"});
    } else {
        res.redirect('/login');
    }
   })
});
// logout

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/login');
          }
    });
})
// database connection
connection.connect((err) => {
    if (err) {
      throw err;   
    } else {
        console.log("Databse connected");
    }
});

router.get('/', Authorised,(req, res) => {
    res.send("Welcome to Backend side of app");
})

//insert data in database
router.get('/add', Authorised,(req, res) => {
    res.render("insert");
});

router.post('/add', Authorised,(req, res) => {

    const {name, place} = req.body;
    const sqlQuery = "INSERT INTO self(name, place) VALUES(?, ?)";
    connection.query(sqlQuery, [name, place], (err) => {
        if (err) {
             throw err;
        } else {
            req.session.message = "User Added Successfully";
            res.status(200).redirect("/user");
        }
    });
});

// Retieve data

router.get('/user', Authorised,(req, res) => {

    const sql =  "SELECT * FROM self";
    connection.query(sql,  (err, data) => {
        if (err) {
            throw err;
        } else {
            const name = req.session.name;
            const message = req.session.message;
            res.status(200).render("user", {user: data, message, name});
        }
    });
})

// update 
router.get('/update/:id', Authorised,(req, res) => {
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

router.post('/update/:id', Authorised,(req, res) => {
    const id = parseInt(req.params.id);
    const {name, place} = req.body;
    const sqlUpdate = `UPDATE self SET name = ?, place = ? WHERE id = ${id}`;
    connection.query(sqlUpdate, [name, place], (err, user) => {
        if (err) {
            throw err;
        } else {
            req.session.message = "User updated successfully";
            res.status(200).redirect('/user');
        }
    })
})
// delete 
router.post('/delete/:id', Authorised,(req, res) => {
    const id = parseInt(req.params.id);
    const sqlDelete = `DELETE FROM self WHERE id = ${id}`;
    connection.query(sqlDelete, (err) => {
        if (err) {
            throw err;
        } else {
             req.session.message = "User deleted successfully";
            res.status(200).redirect('/user');
        }
    });
})
module.exports = router;