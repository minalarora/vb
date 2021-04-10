const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {
    User,
    validateEmail,
    validateGmail
} = require("../models/user");
const {Post,validatePost} = require("../models/post");


router.post('/v1/bookmark/:id',auth,async (req,res)=>{
    try
    {
        let id = req.params.id
        if(req.user.bookmark.includes(id))
        {
            req.user.bookmark = req.user.bookmark.filter((bookmark) => {
                return bookmark != id
            })
            await req.user.save()
            return res.status(200).send({message:'Post removed from favourites!'})
        }
        else
        {
            req.user.bookmark = req.user.bookmark.concat(id)
            await req.user.save()
            return res.status(200).send({message:'Post added in favourites!'})

        }

    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.get('/v1/bookmark',auth,async (req,res)=>{
    try
    {
        // await Invoice.find({ mineid: { $in: minearray } }).sort({ createdAt: -1 }).exec(function (err, invoices)

        await Post.find({id: { $in: req.user.bookmark }}).sort({ createdAt: -1 }).exec(function (err, posts)
        {
            if(posts)
            {
                return res.status(200).send(posts)
            }
            else
            {
                return res.status(200).send([])
            }
        })

    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})








module.exports = router