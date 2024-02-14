const mongoose = require('mongoose');

const postschema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  title: String,
  description: String,
  image:String
});

module.exports = mongoose.model("post", postschema)
