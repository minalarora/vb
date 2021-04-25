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
    date:
    {
        type: String,
        required: true,
        default:  () => { return moment(new Date()).tz("Asia/Kolkata").format("YYYY-MM-DD").toString()}
    },
},{
    timestamps: true
})

PostRatingSchema.methods.addUser = async function () {
    const rating = this
    const ratingobject = rating.toObject()
    const user = await User.findOne({id: rating.userid })
    ratingobject.profile = "https://stark-island-35960.herokuapp.com" + "/v1/user/image/" + user.profile
    ratingobject.username = user.name
    return ratingobject
}

const PostRating = mongoose.model("PostRating",PostRatingSchema) 
module.exports.PostRating = PostRating
