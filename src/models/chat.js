const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 10)
const jwt = require("jsonwebtoken");
const Joi = require("joi");
let moment = require('moment-timezone')

const ChatSchema = new mongoose.Schema({
    id:
    {
        type: Number,
        required: true,
        unique: true,
        default: () => { return nanoid()}
    },
    firstuser:
    {
        type: Number,
        required:true,
        ref: 'User'
    },
    
    seconduser:
    {
        type: Number,
        required:true,
        ref: 'User'
    },
    firstusername:
    {
        type: String,
        required:true,
    },
    
    secondusername:
    {
        type: String,
        required:true,
    },
    firstuserimage:
    {
        type: String,
        default:"",
    },
    
    seconduserimage:
    {
        type: String,
        default:"",
    },

    firstuserseen:
    {
        type: Boolean,
        default: false,
    },

    seconduserseen:
    {
        type: Boolean,
        default: false,
    },
    messages:[
        {
            message:
            {
                type: String,
                required: true
            },
            type:
            {
            type: String,
            required: true,
            enum : ['IMAGE','TEXT','FILE'],
            },
            date:
            {
            type: String,
            required: true,
            default:  () => { return Date.now()}
            },
            who:
            {
            type: Number,
            required: true    
            },

        }
    ],

},
{
    timestamps: true
})


ChatSchema.methods.addMessage = async function(message,type,who)
{
    const chat = this
    chat.messages = chat.messages.concat({message,type,who})
    if(who == chat.firstuser)
    {
        chat.seconduserseen = true;
    }
    else
    {
        chat.firstuserseen = true;
    }
    await chat.save()
    return chat

}

ChatSchema.methods.list = function () {
    const user = this
    const userobject = user.toObject()
    userobject.firstuserimage = "https://images.virtualbazaar.club/" + user.firstuserimage + ".png"
    userobject.seconduserimage = "https://images.virtualbazaar.club/" + user.seconduserimage + ".png"
    userobject.messages = user.messages[user.messages.length - 1] 
    return userobject
}

// UserSchema.methods.generateToken = async function () {
//     const user = this
//     const token = jwt.sign({ _id: user.id }, 'virtual', {
//         expiresIn: '30d'
//     })
//     user.tokens = user.tokens.concat({ token })
//     await user.save()
//     return token
// }

ChatSchema.pre('remove', async function (next) {
    const user = this
    // await Booking.deleteMany({
    //     owner: user.id
    // })

    next()

})

ChatSchema.pre('save', async function (next) {
    const user = this
    //not doing anything for now
    next()
})   

ChatSchema.methods.toJSON = function () {
    const user = this
    const userobject = user.toObject()
    userobject.firstuserimage = "https://images.virtualbazaar.club/" + user.firstuserimage + ".png"
    userobject.seconduserimage = "https://images.virtualbazaar.club/" + user.seconduserimage + ".png"
    return userobject
}

const Chat = mongoose.model("Chat", ChatSchema);


module.exports.Chat = Chat;
