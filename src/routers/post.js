const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {Post,validatePost} = require("../models/post");
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




router.post('/v1/post',auth,upload.fields([{ name: 'images', maxCount: 10 },{name: 'logo',maxCount:1}]),async (req,res)=>
{
    try
    {
        
        
        const {
            error
        } = validatePost(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let keys  = Object.keys(req.files)
        let images  = []
        let logo = null
        for(i in keys)
        {
            for(j=0; j< req.files[keys[i]].length;j++)
            {
                try
                {
                    let image  = await imageupload(req.files[keys[i]][j].buffer)
                    if(keys[i] == "images")
                    {
                        images.push(image.toString())
                    }
                    else
                    {
                        logo  = image.toString()
                    }
                }
                catch(e)
                {

                }
              
            }
        }

        let post  = new Post({...req.body,user: req.user.id,images,logo})
        await post.save()
        return res.status(200).send("POST CREATED SUCCESSFULLY")
        
    }
    catch(e)
    {
        
        return res.status(400).send({message: e.message})
    }
}, (err, req, res, next) => {
    
    return res.status(400).send("middleware error:" + err)
})


router.post('/v1/post/image',auth,upload.single("image"),async (req,res)=>
{
    try
    {
        let image = await imageuploadwithid(req.file.buffer,req.body.id)
        if(image!=0)
        {
    
            return res.status(200).send("Image Uploaded!")
        }
        else
        {
            return res.status(400).send("Unable to upload image!")
        }
        
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})




router.get('/v1/post/me',auth, async (req,res)=>
{
    try
    {
        await req.user.populate({
            path: 'posts',
            match: {
                active: true
            }
            , options: {
                sort: {
                    createdAt: -1
                }
            }
        }).execPopulate()

        return res.status(200).send(req.user.posts)
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})

router.get('/v1/post/category/:id',auth, async (req,res)=>{
    try
    {
        let id = req.params.id
        let posts = await Post.find({active: true, sold: false, category: id,  user:{ "$ne": req.user.id }}, null, { limit: 1000, sort: { createdAt: -1 } }).exec()
        return res.status(200).send(posts)

    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})

router.get('/v1/post/all',auth,async (req,res)=>{
    try
    {
        let posts = await Post.find({active: true, sold: false, user:{ "$ne": req.user.id } }, null, { limit: 1000, sort: { createdAt: -1 } }).exec()
        return res.status(200).send(posts.map((post)=>{
            return post.withBookmark(req.user.bookmark)
        }))

    } 
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})


router.get('/v1/post/single/:id',auth,async (req,res)=>
{
    try {
        const id = req.params.id
        const post = await Post.findOne({ id })
        if (post) {
            return res.status(200).send(post)
        }
        else {
            return res.status(400).send("Unable to load post")
        }
    }
    catch (e) {
        res.status(400).send({message: e.message})
    }
})

router.get('/v1/post/view/:id',auth,async (req,res)=>
{
    try
    {
        let id = req.params.id
        const post = await Post.findOne({ id })
        if(post)
        {
            post.view = post.view + 1
            await post.save()
            return res.status(200)
            
        }
        else
        {
            return res.status(200)
        }

    }
    catch(e)
    {
        return res.status(200)
    }
})

router.get('/v1/post/image/:id',async (req,res)=>
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
        res.status(400).send({message: e.message})
    }
})

router.patch('/v1/post/:id',auth, async (req,res)=>{
    try
    {
        const id = req.params.id
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'description','price','currency','earnings','link','images','type','sold']

        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!isValidOperation && (updates.length > 0)) {
            return res.status(400).send("Invalid Request!")
        }

        const post = await Post.findOne({id})
        updates.forEach((update) => 
            {
                post[update] = req.body[update] 
            })

        await post.save()
        
        
        return res.status(200).send(post)


    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})


router.delete('/v1/post/:id',async (req,res)=>
{
    try
    {
        
        const id = req.params.id
        const post = await Post.findOneAndDelete({id})
        if(post)
        {
             return res.status(200).send(post)   
        }
        else
        {
            return res.status(400).send("Unable to delete post!")
        }
         
    }
    catch(e)
    {
        res.status(400).send({message: e.message})
    }
})


module.exports = router