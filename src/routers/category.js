const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {Category} = require("../models/category");
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


router.post('/v1/category',upload.single("image"),async (req,res)=>
{
    try
    {
        let image = await imageupload(req.file.buffer)
        if(image!=0)
        {
            let category = new Category({...req.body,image})
            await category.save()
            return res.status(200).send("DONE")
        }
        else
        {
            return res.status(400).send("IMAGE FAILURE")
        }
        
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})

router.get('/v1/category',auth, async (req,res)=>
{
    try
    {
        let categories = await Category.find({active: true})
        if(categories)
        {
            return res.status(200).send(categories)
        }
        else
        {
            return res.status(400).send("No category found!")
        }
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})


router.get('/v1/category/image/:id',async (req,res)=>
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


router.patch('/v1/category/:id',async (req,res)=>
{
    try
    {
        const id = req.params.id
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'active']

        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!isValidOperation && (updates.length > 0)) {
            return res.status(400).send("Invalid Request!")
        }

        const category = await Category.findOne({id})
        updates.forEach((update) => 
            {
                category[update] = req.body[update] 
            })

        await category.save()
        
        return res.status(200).send(category)
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})

router.delete('/v1/category/:id',async (req,res)=>
{
    try
    {
        
        const id = req.params.id
        const category = await Category.findOneAndDelete({id})
        if(category)
        {
             return res.status(200).send(category)   
        }
        else
        {
            return res.status(400).send("Invalid ID")
        }
         
    }
    catch(e)
    {
        res.status(400).send({message: e.message})
    }
})

module.exports = router



