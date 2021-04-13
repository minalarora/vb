const jwt=require("jsonwebtoken")
const {User} = require("../models/user")


const auth = async (req,res,next)=>
{
    try
    {
        
        const token=req.header('Authorization')
        const decoded=jwt.verify(token,'virtual')
        const user=await User.findOne({id:decoded._id,"tokens.token" : token , active:true})

        if(!user)
        {
            throw new Error("Authentication Failed!")
        }
        req.user=user
        req.token=token
        next()

    }
    catch(e)
    {
     
        throw new Error("Authentication Failed!")
    }
}

module.exports = auth