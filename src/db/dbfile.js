const mongoose = require("mongoose")
const connectionUrl = 'mongodb+srv://minal:Minal@123@cluster0.oeouq.mongodb.net/virtual-db?retryWrites=true&w=majority' 
const connectionUrl2 = 'mongodb+srv://vb:vb123@cluster0.oeouq.mongodb.net/virtual-images?retryWrites=true&w=majority' 

mongoose.connect(connectionUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})


mongoose.imagedb = mongoose.createConnection(connectionUrl2,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

module.exports = mongoose