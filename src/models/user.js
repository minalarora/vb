const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 5)
const jwt = require("jsonwebtoken");
const Joi = require("joi");


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
    userobject.image  = "https://stark-island-35960.herokuapp.com" + "/v1/user/image/" + user.image
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
    //not doing anything for now
    next()
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