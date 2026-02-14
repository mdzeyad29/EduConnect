const mongoose = require('mongoose');
const addCart = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});
module.exports = mongoose.model("AddCart",addCart);     