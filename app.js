require("./src/db/dbfile")

const express=require("express")
const helmet = require('helmet')
const compression = require('compression')

const UserRouter = require("./src/routers/user")
const CategoryRouter = require("./src/routers/category")





const app=express()

const port= process.env.PORT || 3000


app.use(express.json({limit: '50mb'}));


app.use(UserRouter)
app.use(CategoryRouter)


app.use(helmet())
app.use(compression())


app.listen(port,()=>{

    console.log("server is up on port",port)

})