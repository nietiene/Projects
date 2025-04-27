const express = require("express");
const user = require("./userSchema.js");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userData = await user.find();
        if (userData.length > 0) {
           res.render("userData", {user: userData});
        } else {
            res.status(404).send("No data in system")
        }
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});
//get data based on specied Id

router.get ('/:id', async(req, res) => {
    try {
    const id = parseInt(req.params.id);
    const exist = await user.findOne({id: id});
    
    if (exist) {
        res.render("userData", {user: [exist]});
    } else {
        res.status(404).send("User not found");
    }
 } catch (err) {
    res.status(500).send("Internal server error", err);
 }
});
//inset
router.get('/add', async (req, res) => {
    res.render("insert");
});
// insert
router.post('/add', async (req, res) => {
      try {
        const newUser = await user.create({
            id: parseInt(req.body.id),
            name: req.body.name,
            place: req.body.place
        });

        if (newUser) {
            res.status(201).redirect("/user");

        } else {
            res.status(500).send("Data not inserted");
        }
      } catch (err) {
        res.status(500).send( "Data not inseted", err);
      }
});

// Update user
router.get('/update/:id', async (req, res) => {
     const id = parseInt(req.params.id);
     const index = await user.findOne({id: id});

     if (index) {
        res.render("update", {user: index});
     }
});

// Update user
router.post('/update/:id', async(req, res) => {
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
router.post('/delete/:id', async(req, res) => {
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