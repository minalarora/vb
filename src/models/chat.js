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
    
    date:
    {
        type: String,
        required: true,
        default:  () => { return moment(new Date()).tz("Asia/Kolkata").format("YYYY-MM-DD").toString()}
    },

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
    }


},
{
    timestamps: true
})

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
    return userobject
}

const Chat = mongoose.model("Chat", ChatSchema);


module.exports.Chat = Chat;
