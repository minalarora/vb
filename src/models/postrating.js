const mongoose = require('mongoose')
let Float = require('mongoose-float').loadType(mongoose);
let moment = require('moment-timezone')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 7)
const {User} = require('../models/user')


const PostRatingSchema  = mongoose.Schema({
    id:
    {
        type: String,
        default: () => {
           return nanoid()
        }
    },
    userid:
    {
        type: Number,
        required: true
    },
    postid:
    {
        type: Number,
        required: true
    },
    rating:
    {
        type: Float,
        required: true
    },
    message:
    {
        type: String,
        default:null
    },
    timestamp:
    {
        type: Number,
        required: true,
        default:  () => { return Date.now()}
    },
},{
    timestamps: true
})

PostRatingSchema.methods.addUser = async function () {
    const rating = this
    const ratingobject = rating.toObject()
    const user = await User.findOne({id: rating.userid })
    ratingobject.profile = "https://images.virtualbazaar.club/" + user.profile + ".png"
    ratingobject.username = user.name
    return ratingobject
}

const PostRating = mongoose.model("PostRating",PostRatingSchema) 
module.exports.PostRating = PostRating
