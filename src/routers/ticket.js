const express = require('express')
const router  = new express.Router()
const {Ticket} = require('../models/ticket')
const auth = require('../auth/auth')


router.post("/v1/ticket",auth,async (req,res)=>{
    try
    {
        const ticket  = new Ticket({...req.body,user: req.user.id,username: req.user.name, email: req.user.email})
        await ticket.save()
        //email.sendEmail('TICKET',"" + ticket.category +"\nUser: " + req.user.mobile +"\n" + ticket.message  )
        return res.status(200).send('TICKET REGISTERED! WE GET TO YOU SOON.')        
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})


module.exports = router