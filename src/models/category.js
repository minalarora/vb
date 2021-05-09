const mongoose = require('mongoose')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 5)

const CategorySchema = new mongoose.Schema({

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
        unique: true
    },
    image:
    {
       type: String,
       required: true,
    },
    active:
    {
        type: Boolean,
        default: true
    },
    type:
    {
        type: String,
        default: "ALL",
        enum : ['SELL','PROMOTION','ALL'],
    }
    
})

CategorySchema.methods.toJSON = function () {
    const user = this
    const userobject = user.toObject()
    userobject.image = "https://virtualbazaar.club" + "/v1/category/image/" + user.image
    return userobject
}

CategorySchema.pre('remove', async function (next) {
    const user = this
    // await Booking.deleteMany({
    //     owner: user.id
    // })

    next()

})

CategorySchema.virtual('posts', {
    ref: 'Post',
    localField: 'id',
    foreignField: 'category'
})

const Category = mongoose.model("Category", CategorySchema);

module.exports.Category = Category;