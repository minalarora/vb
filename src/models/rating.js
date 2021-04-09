const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 7)


const RatingSchema  = mongoose.Schema({
    
    userid:
    {
        type: Number,
        required: true
    },
    username:
    {
        type: String,
        required: true
    },
    rating:
    {
        type: Number,
        required: true
    },
    message:
    {
        type: String,
        default:null
    }
},{
    timestamps: true
})

const Rating = mongoose.model("Rating",RatingSchema) 
module.exports.Rating = Rating
