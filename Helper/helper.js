const bcryptjs = require("bcryptjs");
const saltround = 10
const jwt=require("jsonwebtoken")


const hashedpassword = async (password) => {
    const salt = await bcryptjs.genSalt(saltround)
    const hash = await bcryptjs.hash(password, salt)
    return hash
}

const comparepassword = async (password, hashedpassword)=>{
    const comparepass = await bcryptjs.compare(password, hashedpassword)
    return comparepass
}

const createtoken = async (value) => { 
    const token = await jwt.sign(value, process.env.SECRET_CODE, { expiresIn: process.env.EXPIRE })
    return token
}




module.exports = {
    hashedpassword,
    comparepassword,
    createtoken
}