const express = require("express")
const { createpost,getalluserposts, upload } = require("../Controller/Postcontroller")
const router = express.Router();
const multer = require("multer");

const photomiddleware = multer({ dest: "uploads" })




router.post('/createpost/:id', createpost)

router.get('/getalluserposts/:token/:id',getalluserposts)

router.post('/upload',photomiddleware.array("photos",100),upload)


module.exports=router   