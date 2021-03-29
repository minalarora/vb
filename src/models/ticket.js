const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 7)

const TicketSchema  = mongoose.Schema({
    id:
    {
        type: Number,
        default: () => {
           return parseInt(nanoid())
        }
    },
    user:
    {
        type: Number,
        required: true
    },
    username:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    message:
    {
        type: String,
        default:""
    },
    type:
    {
        type: String,
        default:""
    },
    status:
    {
        type: String,
        enum : ['PENDING','COMPLETED'],
        default: 'PENDING'
    }
},{
    timestamps: true
})

const Ticket = mongoose.model("Ticket",TicketSchema) 


module.exports.Ticket = Ticket
