const mongoose = require("mongoose")

const Userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilepicurl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userdata' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userdata' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],

})

const Usermodal = mongoose.model('userdata', Userschema)

module.exports = Usermodal


