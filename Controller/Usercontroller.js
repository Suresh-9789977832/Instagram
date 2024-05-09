const {hashedpassword, comparepassword, createtoken}=require("../Helper/helper")
const Postmodal = require("../Modal/Postmodal")
var Usermodal = require("../Modal/Usermodal");
const jwt = require("jsonwebtoken")
const extpath = require("path")
const fs = require("fs");

const registeruser = async (req, res) => {
  
    try {
        let email = req.body.email
        let fullname = req.body.fullname
        let username = req.body.username
        let password = req.body.password


        if (email && fullname && username && password) {

            if (password.length < 6) {
                res.status(400).send({
                    message: "password must be greater than 6 letters"
                })
            }
            else {
                password = await hashedpassword(password)
    
                const newusername = await Usermodal.findOne({ username })
        
                if (newusername) {
                    res.status(400).send({
                        message: `${username} is already exists try new username`
                    })
                }
                else {
                    const user = await Usermodal.findOne({ email })
        
                    if (!user) {
                        
                        const userdata = await Usermodal.create({ email: email, fullname: fullname, username: username, password: password })
                        res.status(201).send({
                            message: "User Created",
                            data: userdata
                        })
                    }
                    else {
                        res.status(400).send({
                            message: `${email} is already exists`
                        })
                    }
                }
        
            }
        }
        else {
            res.status(400).send({
                message:"Fill all the field"
            })
        }
        }
        
        catch (error) {
        res.status(500).send({
            message: "Internal server error",
            errormessage:error.message
        })
    }
    

}



const loginuser = async(req,res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        
        if (email && password) {
            const checkuser = await Usermodal.findOne({ username: email }) || await Usermodal.findOne({ email: email })
            
            if (checkuser) {
                if (await comparepassword(password, checkuser.password)) {
                    const token = await createtoken({ email: checkuser.email, username: checkuser.username, id: checkuser._id,fullname:checkuser.fullname })
                    const { password, ...finaldata } = checkuser._doc
                    res.cookie('token',token).status(200).send({
                        message:"User login successfull",
                        finaldata,
                        token
                    })
                }
                else {
                    res.status(400).send({
                        message:'Invalid password'
                    })
                }
            }
            else {
                res.status(400).send({
                    message:'Enter valid email id'
                })
            }
            
        }
        else {
            res.status(400).send({
                message:"Fill all the field"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            errormessage:error.message
        })
    }
}


const refreshuser = async (req, res) => {
  try {
    const token = req.params.token
      if (token) {
        await jwt.verify(token, process.env.SECRET_CODE, (err, data) => {
            if (err) {
                res.status(498).send({
                    message:"Token expired"
                })
            }
            res.json(data)
        })
      }
      else {
          res.status(401).send({
              message:"no token"
          })
      }
 
  } catch (error) {
      res.status(500).send({
          message: "Internal server error",
          error:error.message
    })
  }

}

const getallusers = async (req, res) => {
    try {
        let data = await Usermodal.find()
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error:error.message
      })
    }
}




const followinguser = async (req, res) => {
    try {
        const id = req.params.id
        const token = req.params.token

        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(498).send({
                            message:"Token expired"
                        })
                }
                if (data) {
                    await Usermodal.findByIdAndUpdate(data.id, { $push: { following: id } }, { new: true })
                    await Usermodal.findByIdAndUpdate(id, { $push: { followers: data.id } })
                    let final=await Usermodal.findById({_id:data.id})
                    res.status(200).send({message:"following added",final})
                }
            })
                
            }
        else {
            res.status(401).send({
                message:"no token"
            })
        }



    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error:error.message
      })
    }
}


const getfollowedusers = async (req, res) => {
    const token = req.params.token
    try {
        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(498).send({
                        message: "Token expired"
                    })
                }
                if (data) {
                    const users = await Usermodal.findById({ _id: data.id }).populate('following')
                    const final = users.following.map(e => e._id)
                    const followedusers = await (await Usermodal.find({ _id: { $in: final } }).populate("posts"))
                    
                    res.status(200).json(followedusers)
                    
                 }

            })
                
            
        }
        else {
            res.status(401).send({
                message: "no token"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error: error.message
        })
    }

}


    const unfollowuser =async(req,res) => {
    try {
        const id = req.params.id
        const token = req.params.token

        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(498).send({
                            message:"Token expired"
                        })
                }
                if(data) {
                    await Usermodal.findByIdAndUpdate(data.id, { $pull: { following: id } }, { new: true })
                    await Usermodal.findByIdAndUpdate(id, { $pull: { followers: data.id } })
                    let final=await Usermodal.findById({_id:data.id})
                    res.status(200).send({message:"Unfollowed",final})
                }

            })
                
            }
        else {
            res.status(401).send({
                message:"no token"
            })
        }



    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error:error.message
      })
    }
}



const getuserbyid = async (req, res) => {
    try {
        let id = req.params.id
        console.log(id)
        let data=await Usermodal.findById({ _id: id })
        res.status(200).send({
            message: "send",
            data
        })
    } catch (error) {
        res?.status.send({
            message: "internalserver",
            error:error.message 
        })
    }

}

const uploadfile = (req, res) => {

    try {
        let token = req.params.token
        let final=req.body.final
        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(498).send({
                            message:"Token expired"
                        })
                }
                if (data) {
                    await Usermodal.findByIdAndUpdate(data.id, { profilepicurl: final })
                    let newuser=await Usermodal.findById({_id:data.id})
                    res.status(200).send({
                        message: "Profile updated successfully",
                        newuser
                    })
                }
            })
                
            }
        else {
            res.status(401).send({
                message:"no token"
            })
        }

    } catch (error) {
        res?.status(500).send({
            message: "internalserver",
            error:error.message 
        })
    }
}



module.exports = {
    registeruser,
    loginuser,
    refreshuser,
    getallusers,
    followinguser,
    getfollowedusers,
    unfollowuser,
    getuserbyid,
    uploadfile
}