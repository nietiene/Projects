const express = require("express");
const user = require("./userSchema.js");
const session = require("express-session");
const router = express.Router();

// Make our system used by only authorised user

const Authorized = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
}

//Display login Page 
router.get('/login', (req, res) => {
    res.render('login', {
        successMsg: req.session.successMsg,
        errorMsg: req.session.errorMsg,
    });
    delete req.session.successMsg;
    delete req.session.errorMsg;
});

// handle login Logic
router.post('/login', async (req, res) => {

    const {id, name, place} = req.body;
    try {
        const existUser = await user.findOne({id: parseInt(id), name, place});
        if (existUser) {
            req.session.isLoggedIn = true;
            req.session.name = existUser.name;
            req.session.user = {id: existUser.id, name: existUser.name, place: existUser.place};
            req.session.successMsg = "Welcome to our site";
            res.redirect('/user');
        } else {
            req.session.errorMsg = "Invalid credentials";
            res.redirect("/user/login");
        }    
    } catch (err) {
        req.session.errorMsg = "Server Error";
        res.redirect("/user/login");
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/user/login')
        }
    });
});

// Avoid user back In system after logout
router.use((req, res, next) => {
    res.set('Cache-control', 'no-store')
    next();
})
// Create account
router.get('/register', (req, res) => {
     res.render('register');
});

// Create  Account
router.post('/register', async (req, res) => {
    try {
        const {id, name, place} = req.body; 
        const exist = await user.findOne({id: id});
        if (!exist) {
            const NewUser = await user.create({id: id, name: name, place: place});
            if (NewUser)
            req.session.successMsg = "Register done successfully please create an account";
            res.redirect('/user/login');
        } else {
            req.session.errorMsg = "account does not created please try again";
            res.redirect('/user/register');
        }
        } catch (err) {
            req.session.errorMsg = "Database Error";
            res.redirect('/user/register');
        }
})

router.get('/', Authorized ,async (req, res) => {
    try {
        const userData = await user.find();
        if (userData.length > 0) {
            const name = req.session.name;
           res.render("userData", {user: userData, name});
        } else {
            res.status(404).send("No data in system")
        }
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});
// get data based on specied Id

router.get ('/:id', Authorized ,async(req, res) => {
    try {
    const id = parseInt(req.params.id);
    const exist = await user.findOne({id: id});
    
    if (exist) {
        res.render("userData", {user: [exist]}); // Make it as an array to avoid an error
    } else {
        res.status(404).send("User not found");
    }
 } catch (err) {
    res.status(500).send("Internal server error", err);
 }
});
// //inset
// router.get('/Add', Authorized ,async (req, res) => {
//     res.render("insert");
// });
// // insert
// router.post('/Add', Authorized ,async (req, res) => {
//       try {
//         const newUser = await user.create({
//             id: parseInt(req.body.id),
//             name: req.body.name,
//             place: req.body.place
//         });

//         if (newUser) {
//             res.status(201).redirect("/user");

//         } else {
//             res.status(500).send("Data not inserted");
//         }
//       } catch (err) {
//         res.status(500).send( "Data not inseted");
//       }
// });

// Update user
router.get('/update/:id', Authorized ,async (req, res) => {
     const id = parseInt(req.params.id);
     const index = await user.findOne({id: id});

     if (index) {
        res.render("update", {user: index});
     }
});

// Update user
router.post('/update/:id', Authorized ,async(req, res) => {
       try {
        const id = parseInt(req.params.id);
        const Updated = await user.findOneAndUpdate(
           {id: id},
           {name: req.body.name, place: req.body.place},
           {new : true}
        );

        if (Updated) {
            res.status(200).redirect('/user');
        } else {
            res.status(404).send("Data not updated");
        }
       } catch (err) {
        res.status(500).send("Data not updated");
       }
})

// Delete user
router.post('/delete/:id', Authorized ,async(req, res) => {
      try {
        const id = parseInt(req.params.id);
        const deleted = await user.findOneAndDelete({id: id}) 
        
        if (deleted) {
            res.status(200).redirect('/user');
        } else {
            res.status(404).send("User not found");
        }
      }  catch (err) {
        res.status(500).send("Data not deleted");
      }      
 });


module.exports = router;