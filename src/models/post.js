const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 9)
let moment = require('moment-timezone')
let Float = require('mongoose-float').loadType(mongoose);
const Joi = require("joi");

const PostSchema  = mongoose.Schema({
    id:
    {
        type: Number,
        required: true,
        unique: true,
        default: () => { return nanoid()}
    },
    name:
    {
        type: String,
        required: true,
    },
    description:
    {
        type: String,
        required: true
    },
    price:
    {
        type: String,
        required: true
    },
    currency:
    {
        type: String,
        default:"USD",
        
    },
    earnings:
    {
        type: String,
        default: "0"
    },
    link:
    {
        type: String,
        default: null
    },
    images:
    {
        type: [String],
        required: true
    },
    logo:
    {
        type: String,
        default: null
    },
    view:
    {
        type: Number,
        default: 0
    },
    type:
    {
        type: String,
        required: true,
        enum : ['PROMOTION','SELL','ALL'],
    },
    fanbase:
    {
        type: String,
        default: "0"
    },
    date:
    {
        type: String,
        required: true,
        default:  () => { return moment(new Date()).tz("Asia/Kolkata").format("YYYY-MM-DD").toString()}
    },
    active:
    {
        type: Boolean,
        default: true
    },
    sold:
    {
        type: Boolean,
        default: false
    },
    user:
    {
        type: Number,
        required:true,
        ref: 'User'
    },
    category:
    {
        type: Number,
        required: true,
        ref: 'Category'
    }

},
{
    timestamps: true
}
    )


    PostSchema.pre('remove', async function (next) {
        const user = this
        // await Booking.deleteMany({
        //     owner: user.id
        // })
    
        next()
    
    })
    
    PostSchema.pre('save', async function (next) {
        const user = this
        //not doing anything for now
        next()
    })   
    
    
    PostSchema.methods.toJSON = function () {
        const user = this
        const userobject = user.toObject()
        for(i in user.images)
        {
            userobject.images[i] = "https://images.virtualbazaar.club/" + user.images[i] + ".png"
        }
        userobject.logo = "https://images.virtualbazaar.club/" + user.logo + ".png"
        return userobject
    }

    PostSchema.methods.withBookmark = function (bookmark) {
        const user = this
        const userobject = user.toObject()
        for(i in user.images)
        {
            userobject.images[i] = "https://images.virtualbazaar.club/" + user.images[i] + ".png"
        }
        userobject.logo = "https://images.virtualbazaar.club/" + user.logo + ".png"
        if(bookmark.includes(user.id))
        {
            userobject.bookmark = true
        }
        else
        {
            userobject.bookmark = false
        }
        return userobject
    }

    const Post = mongoose.model("Post", PostSchema);

    function validatePost(post) {

        const schema = Joi
            .object({
    
                name: Joi
                    .string()
                    .min(5)
                    .max(250)
                    .required(),
    
                description: Joi
                    .string()
                    .min(3)
                    .max(2300)
                    .required(),
                
                price: Joi.string().
                required(),


                earnings: Joi.string(),

                link: Joi.string(),

                type: Joi
                    .string()
                    .min(3)
                    .max(300)
                    .required(),
                
                category: Joi.number().
                min(0).
                max(1000000).
                required(),    

                fanbase: Joi.string()
         
            }   
    
            )
    
        try {
            return schema.validate(post);
        } catch (err) {
            return err
        };
    
    }

    module.exports.Post = Post;
    module.exports.validatePost = validatePost
