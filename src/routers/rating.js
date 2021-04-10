const express = require('express')
const router  = new express.Router()
const {Rating} = require('../models/rating')
const auth = require('../auth/auth')

router.post("/v1/rating",auth,async (req,res)=>{
    try
    {
       
        const rating  = new Rating({...req.body,userid: req.user.id,username: req.user.name})
        await rating.save()
        return res.status(200).send({message:"Thanks for the feedback!"})     
    }
    catch(e)
    {
        
        res.status(400).send({message: e.message})
    }
})


module.exports = router