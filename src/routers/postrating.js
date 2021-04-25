const express = require('express')
const router  = new express.Router()
const {PostRating} = require('../models/postrating')
const auth = require('../auth/auth')

router.post("/v1/postrating",auth,async (req,res)=>{
    try
    {
       
        const rating  = new PostRating({...req.body,userid: req.user.id})
        await rating.save()
        return res.status(200).send({message:"Thanks for the feedback!"})     
    }
    catch(e)
    {
        
        res.status(400).send(e.message)
    }
})

router.get('/v1/postrating/:postid',auth,async (req,res)=>{
    try
    {
        const postid = req.params.postid
        // await Chat.find({ $or : [ { firstuser: req.user.id }, { seconduser: req.user.id } ] }).
        //sort({ createdAt: -1 }).exec(function (err, chats) {
        //     if (chats) {
        //         res.status(200).send(chats.map((chat)=>{
        //             return chat.list()
        //         }))
        //     }
        //     else {
        //         res.status(200).send([])
        //     }
        // })
        const ratings  = await PostRating.find({postid})
        let res_ratings = []
        for(i in ratings)
        {
            const data = await ratings[i].addUser()    
            res_ratings = res_ratings.concat(data)
        }
        
        return res.status(200).send(res_ratings)
        }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

router.patch('/v1/postrating/:id',auth,async (req,res)=>{
    try
    {
        const id = req.params.id
        const updates = Object.keys(req.body)
        const allowedUpdates = ['rating', 'message']

        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!isValidOperation && (updates.length > 0)) {
            return res.status(400).send("Invalid Request!")
        }

        const post = await PostRating.findOne({id})
        updates.forEach((update) => 
            {
                post[update] = req.body[update] 
            })

        await post.save()
        
        
        return res.status(200).send(post)

    }
    catch(e)
    {
        res.status(400).send(e.message) 
    }
})


router.delete('/v1/postrating/:id',auth,async (req,res)=>{
    try
    {
        const id = req.params.id
        const post = await PostRating.findOneAndDelete({id})
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
        res.status(400).send(e.message) 
    }
})
module.exports = router