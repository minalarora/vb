const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 5)
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {Chat} = require('./chat')


const UserSchema = new mongoose.Schema({
    id:
    {
        type: Number,
        required: true,
        unique: true,
        default: () => { return nanoid()}
    },
    uid:
    {
        type: String,
        default: null,
        minlength: 5,
        maxlength: 255,
    },
    name:
    {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password:
    {
        type: String,
        default:null,
        minlength: 5,
        maxlength: 255,
    },
    notifications:
    {
        type: [String],
        default:[]
    },
    profile:
    {
        type: String,
        default: null
    },
    active:
    {
        type: Boolean,
        default: true
    },
    type:
    {
        type: String,
        required: true,
        enum : ['EMAIL','GMAIL'],
    },
    bookmark:
    {
        type: [Number],
        default: []
    },
    tokens: [
        {
            token: {
                type: String,
                createdAt: {
                    type: Date,
                    expires: '31d',
                    default: Date.now
                },
                required: true
            }
        }
    ]
},
 {
    timestamps: true
}
)


UserSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id }, 'virtual', {
        expiresIn: '30d'
    })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


UserSchema.methods.generateNotification = async function (token) {
    const user = this
    if(!user.notifications.includes(token))
    {
        user.notifications = user.notifications.concat(token)
        await user.save()
    }
    return
}


UserSchema.methods.toJSON = function () {
    const user = this
    const userobject = user.toObject()
    delete userobject.password
    delete userobject.tokens
    userobject.profile  = "https://stark-island-35960.herokuapp.com" + "/v1/user/image/" + user.profile
    return userobject
}

UserSchema.pre('remove', async function (next) {
    const user = this
    // await Booking.deleteMany({
    //     owner: user.id
    // })

    next()

})

UserSchema.pre('save', async function (next) {
    const user = this
    try
    {
        
    let condition_one = {firstuser: user.id};
    let condition_two = {seconduser: user.id};
    let update_one = {
        $set : {
            firstuserimage: user.profile
      }
    };
    let update_two = {
        $set : {
            seconduserimage: user.profile
      }
    };
    let options = { multi: true, upsert: false };
    await Chat.updateMany(condition_one,update_one,options,(err,res)=>{
        console.log(res)
    })
    await Chat.updateMany(condition_two,update_two,options,(err,res)=>{
        console.log(res)
    })
    }
    catch(e)
    {

    }
    next()
})


UserSchema.virtual('posts', {
    ref: 'Post',
    localField: 'id',
    foreignField: 'user'
})

UserSchema.virtual('notification_list', {
    ref: 'Notification',
    localField: 'id',
    foreignField: 'user'
})

const User = mongoose.model("User", UserSchema);


function validateUserByEmail(user) {

    const schema = Joi
        .object({

            email: Joi
                .string()
                .min(5)
                .max(250)
                .required()
                .email({
                    minDomainSegments: 2,
                    tlds: {
                        allow: ["com", "net"],
                    },
                }),

            password: Joi
                .string()
                .min(3)
                .max(20)
                .required(),
            
            name: Joi.string().
            min(3).
            max(255).
            required(),

            notification: Joi.string().
            min(3).
            max(255)
            
        }
        

        )

    try {
        return schema.validate(user);
    } catch (err) {
        return err
    };

}

function validateUserByGmail(user) {

    const schema = Joi
        .object({

            email: Joi
                .string()
                .min(5)
                .max(250)
                .required()
                .email({
                    minDomainSegments: 2,
                    tlds: {
                        allow: ["com", "net"],
                    },
                }),
            
            name: Joi.string().
            min(3).
            max(255).
            required(),

            uid: Joi.string().
            min(3).
            max(255).
            required(),

            notification: Joi.string().
            min(3).
            max(255),

            
            
        }

        )

    try {
        return schema.validate(user);
    } catch (err) {
        return err
    };

}

module.exports.User = User;
module.exports.validateEmail = validateUserByEmail;
module.exports.validateGmail = validateUserByGmail;