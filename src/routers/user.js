const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {
    User,
    validateEmail,
    validateGmail
} = require("../models/user");


router.post('/v1/user/email',async (req,res)=>
{
    try
    {
        const {
            error
        } = validateEmail(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) return res.status(400).send("User already registered.");

        user  =  new User({...req.body,type:"EMAIL"})
        const token=await user.generateToken()

        if(req.body.notification) await user.generateNotification(req.body.notification) 

        await user.save()
        return res.status(200).send({token,user})
    }
    catch(e)
    {
       return res.status(400).send(e.message)
    }
})

router.post('/v1/user/gmail',async (req,res)=>
{
    try
    {
        const {
            error
        } = validateGmail(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            uid: req.body.uid,
        });

        if (!user) 
        {
            user  =  new User({...req.body,type:"GMAIL"})
        }

       
        const token=await user.generateToken()

        if(req.body.notification) await user.generateNotification(req.body.notification) 

        await user.save()
        return res.status(200).send({token,user})
    }
    catch(e)
    {
       return res.status(400).send(e.message)
    }
})

router.post('/v1/login',async (req,res)=>{
    try
    {
        let user = await User.findOne({ email: req.body.email})
        if (user) {
            if (user.password == req.body.password ) {
                const token = await user.generateToken()
                if(req.body.notification) await user.generateNotification(req.body.notification)
                await user.save()
                return res.status(200).send({token,user})
            }
            else {
                return res.status(401).send("Invalid Credentials!")
            }
        }
        return res.status(400).send("User not found!")

    }
    catch(e)
    {
        return res.status(400).send(e.message)   
    }
})


router.post('/v1/logout',auth,async (req,res)=>
{
    try
    {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        req.user.notifications = req.user.notifications.filter((notification) => {
            return notification != req.body.notification
        })
        await req.user.save()
        return res.status(200).send()
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.get('/v1/user',auth, async (req,res)=>
{
    try
    {
        
        if(req.query.id)
        {
            const user = await User.findOne({id: req.query.id})
        
             if(user)
             {
                return res.status(200).send(user)   
             }
            else
            {
                return res.status(400).send("User not found!")
            }    
        }
        else
        {
            return res.status(200).send(req.user)
        }
    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.patch('/v1/user',auth, async (req,res)=>{
    try
    {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email','password']

        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!isValidOperation && (updates.length > 0)) {
            return res.status(400).send("Invalid Request!")
        }

        updates.forEach((update) => 
            {
                req.user[update] = req.body[update] 
            })

        await req.user.save()
        
        return res.status(200).send(req.user)


    }
    catch(e)
    {
        return res.status(400).send(e.message)
    }
})

router.delete("/v1/user",auth,async (req,res)=>
{
    try
    {
        await req.user.remove()
        res.status(200).send(req.user)

    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})


module.exports = router