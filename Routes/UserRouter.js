const express = require("express")
const multer=require("multer")
const router = express.Router()


const singlemiddle = multer({ dest: "uploads" })


const { registeruser, loginuser,refreshuser,getallusers,followinguser,getfollowedusers, unfollowuser,getuserbyid, fileupload, uploadfile} = require("../Controller/Usercontroller")

const upload=multer({dest:'uploads'})

router.post('/signup', registeruser)

router.post('/login', loginuser)

router.get('/refreshuser/:token', refreshuser)

router.get('/getallusers', getallusers)

router.patch('/followinguser/:token/:id', followinguser)

router.get('/getfollowedusers/:token', getfollowedusers)


router.patch('/unfollowuser/:token/:id', unfollowuser)  

router.get('/:id', getuserbyid)

router.post('/singleupload/:token',upload.single('file'),uploadfile)



module.exports=router