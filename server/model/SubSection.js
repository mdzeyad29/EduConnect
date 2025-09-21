const mongoose = require("mongoose");

const subSection = new mongoose.Schema({
title:{
  type:String
} ,
timeDuration:{
    type:String
},
description:{
    type:String
},
videoFile:{
    type:String
}

});
module.exports = mongoose.model("subSection",subSection);
