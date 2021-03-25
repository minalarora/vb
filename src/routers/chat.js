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

router.post('/v1/chat/:id',auth,async (req,res)=>{
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
            chat = new Chat({firstuser: req.user.id, seconduser: req.params.id,firstusername: req.user.name, secondusername: seconduser.name})
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

router.post('/v1/chat/image',auth,upload.single("image"),async (req,res)=>
{
    try
    {
        let image = await imageupload(req.file.buffer)
        if(image!=0)
        {
            req.user.image  = image
            await req.user.save()
            return res.status(200).send("https://stark-island-35960.herokuapp.com" + "/v1/chat/image/" + image)
        }
        else
        {
            return res.status(400).send("Unable to upload image!")
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
        await Chat.find({firstuser: req.user.id}).sort({ createdAt: -1 }).exec(function (err, chats) {
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

router.get('/v1/chat/sell',auth,async (req,res)=>{
    try
    {
        await Chat.find({seconduser: req.user.id}).sort({ createdAt: -1 }).exec(function (err, chats) {
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

