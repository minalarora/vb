require("./src/db/dbfile")

const express=require("express")
const http = require("http")
const socketio = require('socket.io')
const path = require('path')
// const ejs = require('ejs')
const helmet = require('helmet')
const compression = require('compression')

const UserRouter = require("./src/routers/user")
const CategoryRouter = require("./src/routers/category")
const PostRouter = require("./src/routers/post")
const ChatRouter = require('./src/routers/chat')
const BookmarkRouter = require('./src/routers/bookmark')
const TicketRouter = require('./src/routers/ticket')
const NotificationRouter = require('./src/routers/notification')
const RatingRouter = require('./src/routers/rating')
const PostRatingRouter = require('./src/routers/postrating')


const app=express()
const server = http.createServer(app)
// const io = socketio(server)


const port= process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.get('/tac', function(req, res,next) {
    res.sendFile(__dirname + '/tac.html');
});

app.get('/virtualbazaar', function(req, res,next) {
    res.sendFile(__dirname + '/vb.html');
});


app.use(express.json({limit: '50mb'}));
app.use(helmet())
app.use(compression())


app.use(UserRouter)
app.use(CategoryRouter)
app.use(PostRouter)
app.use(ChatRouter)
app.use(BookmarkRouter)
app.use(TicketRouter)
app.use(NotificationRouter)
app.use(RatingRouter)
app.use(PostRatingRouter)



server.listen(port,()=>{

    console.log("server is up on port",port)

})




// module.exports.io = io
// require('./src/utils/chatfunction')



//https://virtualbazaar.club/