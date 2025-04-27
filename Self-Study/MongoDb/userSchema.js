const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id:{type: Number, required: true, unique: true},
    name:{type: String},
    place:{type: String},
});

module.exports = mongoose.model("userSchema", userSchema);