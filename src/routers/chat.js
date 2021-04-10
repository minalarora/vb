const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {
    User,
    validateEmail,
    validateGmail
} = require("../models/user");
const {Chat} = require("../models/chat")
const {imageupload, imagedownload}  = require('../utils/imageupload')
var multer = require('multer')

var upload = multer({
    limits:
    {   
        
    },
    fileFilter: function (req, file, cb) {

        return cb(undefined, true);

    }
})

router.post('/v1/chat/create/:id',auth,async (req,res)=>{
    try
    {
        let seconduser = await User.findOne({
            id: req.params.id, active: true
        });

        if(seconduser)
        {
            let chat = await Chat.findOne({firstuser: req.params.id,seconduser: req.user.id})
            if(chat)
            {
                return res.status(200).send(chat)
            }
            chat = await Chat.findOne({firstuser: req.user.id,seconduser: req.params.id})
            if(chat)
            {
                return res.status(200).send(chat)
            }
            chat = new Chat({firstuser: req.user.id, seconduser: req.params.id,firstusername: req.user.name, secondusername: seconduser.name,firstuserimage: req.user.image, seconduserimage: seconduser.image})
            await chat.save()
            return res.status(200).send(chat)
            
        }
        else
        {
            return res.status(400).send('Unable to find user!')
        }
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})


router.post('/v1/chat/message',auth,async (req,res)=>{
    try
    {
        let oldchat = await Chat.findOne({id: req.body.id})
        if(oldchat && req.body.message)
        {
            let newchat = await oldchat.addMessage(req.body.message,'TEXT',req.user.id)
            return res.status(200).send(newchat)
        }
        else
        {
            return res.status(400).send("Unable to send message!")
        }
    }
    catch(e)
    {
        console.log(e);
        return res.status(400).send(e.message)
    }
})

router.post('/v1/chat/image',auth,upload.fields([{ name: 'images', maxCount: 4 }]),async (req,res)=>
{
    try
    {
        // {
            //id-> chatid, image 
        // }
        let oldchat = await Chat.findOne({id: req.body.id})
        if(oldchat)
        {
            // let image = await imageupload(req.file.buffer)
            // if(image!=0)
            // {

            //     let newchat = await oldchat.addMessage("https://stark-island-35960.herokuapp.com" + "/v1/chat/image/" + image,'IMAGE',req.user.id)
            //     return res.status(200).send(newchat)
    
            // }
            // else
            // {
            //     return res.status(400).send("Unable to send image!")
            // }   
            let keys  = Object.keys(req.files)
            let images  = ""
            for(i in keys)
            {
                for(j=0; j < req.files[keys[i]].length;j++)
                {
                    try
                    {
                        let image  = await imageupload(req.files[keys[i]][j].buffer)
                        if(keys[i] == "images")
                        {
                            //images.push(image.toString())
                            let url = "https://stark-island-35960.herokuapp.com" + "/v1/chat/image/" + image;
                            images  = images + url +","
                             
                        }
                        else
                        {
                         //   logo  = image.toString()
                        }
                    }
                    catch(e)
                    {
    
                    }
                  
                }
            }
                let newchat = await oldchat.addMessage(images,'IMAGE',req.user.id)
                return res.status(200).send(newchat)   
        }
        else
        {
            return res.status(400).send("Unable to send image!")
        }
        
        
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.get('/v1/chat/image/:id',async (req,res)=>
{
    try
    {
        const id = req.params.id
        const imgobj = await imagedownload(id)
        if(imgobj)
             {
                    res.set('Content-Type', 'image/png')
                    return res.send(imgobj[0].image)    
            }
        else
             {
                   return res.status(400).send("Image not found!")
            }
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

router.get('/v1/chat/single',auth,async (req,res)=>{
    try
    {
        //user
        //id
        let seconduser = await User.findOne({
            id: req.query.user, active: true
        });

        if(seconduser)
        {
            let chat = await Chat.findOne({id: req.query.id})
            if(chat)
            {
                return res.status(200).send(chat)
            }
            else
            {
                return res.status(400).send('Unable to load chat!')    
            }
            
        }
        else
        {
            return res.status(400).send('Unable to find user!')
        }
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.get('/v1/chat/buy',auth,async (req,res)=>{
    try
    {
        await Chat.find({ $or : [ { firstuser: req.user.id }, { seconduser: req.user.id } ] }).sort({ createdAt: -1 }).exec(function (err, chats) {
            if (chats) {
                res.status(200).send(chats.map((chat)=>{
                    return chat.list()
                }))
            }
            else {
                res.status(200).send([])
            }
        })
        
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

// router.get('/v1/chat/sell',auth,async (req,res)=>{
//     try
//     {
//         await Chat.find({seconduser: req.user.id}).sort({ createdAt: -1 }).exec(function (err, chats) {
//             if (chats) {
//                 res.status(200).send(chats.map((chat)=>{
//                     return chat.list()
//                 }))
//             }
//             else {
//                 res.status(200).send([])
//             }
//         })
        
//     }
//     catch(e)
//     {
//         return res.status(400).send(e.message)
//     }
// })

router.get('/v1/chat/:id',auth,async (req,res)=>{
    try
    {
        let chat = await Chat.findOne({id: req.params.id})
        return res.status(200).send(chat)
    }
    catch(e)
    {

    }
})




module.exports = router

