const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb+srv://malpanianshi:malpanianshi2805@cluster0.mwv3qjn.mongodb.net/pinterest")

const userschema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  contact: Number,
  name: String,
  profileImage: String,
  boards: {
    type: Array,
    default: []
  },
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  ]

});
userschema.plugin(plm)

module.exports = mongoose.model("users", userschema)
