const {User} = require("../models/user")
const {Post,validatePost} = require("../models/post");
const {Chat} = require("../models/chat")
const {imageupload, imagedownload}  = require('../utils/imageupload')
var multer = require('multer')
const {io} = require('../../app')

var upload = multer({
    limits:
    {
        
    },
    fileFilter: function (req, file, cb) {

        return cb(undefined, true);

    }
})

io.on('connection', (socket)=>{


    console.log('a new connection')
    let roomid = null
    socket.on('join',async (room,callback)=>{
        console.log('joined' + room)
        socket.join(room)
        let chat = await Chat.findOne({id: room})
        roomid = chat.id   
        callback(chat.messages)
    })

    socket.on('sendmessage', async (obj,callback)=>{
        
        socket.broadcast.to(obj.id).emit('receivemessage',obj)
        callback()
    })

    socket.on('disconnect',(roomid)=>{
      socket.leave()   
    })



})

// io.on('connection',(socket)=>{

//     socket.on('join',async (room)=>{
//         socket.join(room)
//         socket.broadcast.to(room).emit('done','a new user has been added')

//     })
//     // console.log("New connection!")
//     // socket.emit('countUpdated',{message:"my name is khan!"},()=>{
//     //     console.log("delivered!")
//     // })
//     // socket.on('received',(socket)=>{

       
//     //     console.log(socket.message)
//     // })

// })


