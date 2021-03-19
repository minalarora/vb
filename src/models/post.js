const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 5)
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
        type: Float,
        required: true
    },
    currency:
    {
        type: String,
        default:"USD",
        
    },
    earnings:
    {
        type: Float,
        default: 0
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
    view:
    {
        type: Number,
        default: 0
    },
    type:
    {
        type: String,
        required: true,
        enum : ['PROMOTION','BUY'],
    },
    date:
    {
        type: String,
        required: true,
        default:  () => { return moment(new Date(invoice.createdAt)).tz("Asia/Kolkata").format("YYYY-MM-DD").toString()}
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
            userobject.images[i] = "https://stark-island-35960.herokuapp.com" + "/v1/post/image/" + user.images[i] 
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
                    .max(300)
                    .required(),
                
                price: Joi.number().
                min(0).
                max(100000).
                required(),


                earnings: Joi.number().
                min(0).
                max(100000),

                link: Joi.string()
                 .min(5)
                .max(250)
                .uri(),

                type: Joi
                    .string()
                    .min(3)
                    .max(300)
                    .required(),
                
                category: Joi.number().
                min(0).
                max(1000000).
                required(),    

                images : Joi.array().items(Joi.string()).required()
         
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
