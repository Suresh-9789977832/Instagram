const mongoose = require("mongoose")

const Postschema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Usermodal", required: true },
    username:String,
    posts: String,
    desc:String,
    likes: {
        type: Number,
        default:0
    },
    profile:String,
    comments: [String]
})

const Postmodal = mongoose.model("Posts", Postschema)

module.exports=Postmodal