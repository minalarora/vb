require("./src/db/dbfile")

const express=require("express")
const http = require("http")
const socketio = require('socket.io')
const helmet = require('helmet')
const compression = require('compression')

const UserRouter = require("./src/routers/user")
const CategoryRouter = require("./src/routers/category")
const PostRouter = require("./src/routers/post")
const ChatRouter = require('./src/routers/chat')


const app=express()
const server = http.createServer(app)
const io = socketio(server)


const port= process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});


app.use(express.json({limit: '50mb'}));
app.use(helmet())
app.use(compression())


app.use(UserRouter)
app.use(CategoryRouter)
app.use(PostRouter)
app.use(ChatRouter)




server.listen(port,()=>{

    console.log("server is up on port",port)

})




module.exports.io = io
require('./src/utils/chatfunction')



//https://stark-island-35960.herokuapp.com/