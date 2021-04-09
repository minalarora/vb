const mongoose = require('mongoose')
const Joi = require("joi");
const {User} = require('../models/user')
const {sendNotification} = require('../utils/createnotification')

const NotificationSchema  = mongoose.Schema({

    user:
    {
        type: Number,
        required:true,
        ref: 'User'
    },
    body:
    {
        type: String,
        required:true

    },
    header:
    {
        type: String,
        required:true

    },
    type:
    {
        type: String,
        default: "OTHER",
        enum : ['PROFILE','POST','CHAT','OTHER'],
    },
    date:
            {
            type: String,
            required: true,
            default:  () => { return Date.now()}
            },

},
{
    timestamps: true
})

NotificationSchema.pre('remove', async function (next) {
    const user = this
    // await Booking.deleteMany({
    //     owner: user.id
    // })

    next()

})

NotificationSchema.pre('save', async function (next) {
    const notification = this
    let user = await User.findOne({id: notification.user})
    if(user)
    {
    sendNotification(notification.header,notification.body,notification.type,user.notifications)
    next()
    }
})


NotificationSchema.statics.createNotification  = async function (user,body,header,type) {
    let notification = new Notification({user,body,header,type})
    await notification.save()
    return;
}
 


const Notification  = mongoose.model("Notification",NotificationSchema)
module.exports.Notification = Notification

