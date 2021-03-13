const express = require('express')
const router  = new express.Router()
const auth = require("../auth/auth")
const {
    User,
    validate
} = require("../models/user");


router.post('/v1/user',async (req,res)=>
{
    try
    {
        const {
            error
        } = validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) return res.status(400).send("User already registered.");

        user  =  new User(req.body)
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

router.post('/v1/login',async (req,res)=>{
    try
    {
        let user = await User.findOne({ mobile: req.body.mobile })
        if (user) {
            if (user.password == req.body.password) {
                const token = await user.generateToken()
                await user.save()
                return res.status(200).send({token,user})
            }
            else {
                return res.status(401).send("Wrong Password!")
            }
        }
        user = await User.findOne({ email: req.body.mobile })
        if (user) {
            if (user.password == req.body.password) {
                const token = await user.generateToken()
                await user.save()
                return res.status(200).send({token,user})
            }
            else {
                return res.status(401).send("Wrong Password!")
            }
        }
        return res.status(400).send("User not found!")

    }
    catch(e)
    {
        return res.status(400).send(e.message)   
    }
})

module.exports = router