const Postmodal = require("../Modal/Postmodal")
const jwt = require("jsonwebtoken")
const extpath = require("path")
const fs=require("fs")
const Usermodal = require("../Modal/Usermodal")

const createpost =async (req,res)=>{
    try {
        const { posts, desc,comments} = req.body
        const token = req.params.id
        
        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(401).send({
                        message:"token expired"
                    })
                }
                const user=await Usermodal.findById({_id:data.id})
                const finaldata = await Postmodal.create({ posts, desc, owner: data.id, comments,username:data.username,profile:user.profilepicurl})
                res.status(201).send({
                    message: "post created",
                    finaldata,
                })
                 Usermodal.findByIdAndUpdate(finaldata.owner, { $push: { posts: finaldata._id } }, { new: true })
                    .then(user => console.log(user))
                .catch(error=>console.error("error:",error))
            })
           
        }
        
    } catch (error) {
        res.status(500).send({
            message: "Intenal server error",
            errormessage:error.message
        })
    }
}

const getalluserposts = async(req,res) => {
   
    try {
        let id = req.params.id
        let token = req.params.token
        if (token) {
            jwt.verify(token, process.env.SECRET_CODE, async (err, data) => {
                if (err) {
                    res.status(498).send({
                            message:"Token expired"
                        })
                }
                if(data) {
                      const user = await Usermodal.findById({ _id: id }).populate("posts")
                    res.status(200).send(user)
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
            errormessage:error.message
           })
        }
  
    
}

const upload = async (req, res) => {
    try {
        const uploadedfiles=[]
    for (let i = 0; i < req.files.length; i++){
        const { path,originalname } = req.files[i]
        const ext=extpath.extname(originalname)
        const newpath = path + ext
        fs.renameSync(path, newpath)
        uploadedfiles.push(newpath.replace('upload/', ""))
    }
    res.json(uploadedfiles)
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error:error.message     
        })
    }
   
}




module.exports = {
    createpost,
    getalluserposts,
    upload,
    
}