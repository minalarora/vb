const express = require('express')
const router  = new express.Router()
const {Notification} = require('../models/notification')
const auth = require('../auth/auth')


router.post('/v1/notification',auth,async (req,res)=>{
    try
    {
        let notification = new Notification({...req.body,user: req.user.id})
        await notification.save()
        return res.status(200).send(notification)
    }
    catch(e)
    {
        return res.status(400).send({message: e.message})
    }
})

router.get("/v1/notification", auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'notification_list'
            , options: {
                limit:500,
                sort: { createdAt : -1}
            }
        }).execPopulate()

      
        res.status(200).send(req.user.notification_list)
    
    }
    catch (e) {
        res.status(400).send({message: e.message})
    }
  
})

module.exports = router

