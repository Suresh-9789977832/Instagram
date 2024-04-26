const env = require("dotenv")
env.config()
const express = require("express")
const app = express()
const cors = require("cors")
const router = require("./Routes/UserRouter")
const postrouter = require('./Routes/PostRouter')
const mongoose = require("mongoose")


    app.use(cors({
        credentials: true,
        origin: 'http://localhost:5174'
        
    }))

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)

app.use('/uploads', express.static(__dirname + '/uploads'))


app.use(express.json())
app.use('/user', router)
app.use('/post',postrouter)


// app.get('/', (req, res) => {
//     res.json('hello world')
// })


app.listen(process.env.PORT,()=>console.log(`app is running in port ${process.env.PORT}`))