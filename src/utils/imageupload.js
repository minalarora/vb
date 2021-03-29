const db = require('../db/dbfile')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 10)
const mongoose = require("mongoose")
var sharp = require('sharp')
var Schema = mongoose.Schema;

let imageupload  = async function (buffer) {
    try
    {
        let name = nanoid()

        let model = db.imagedb.model(name, 
                new Schema({ image: Buffer}), name);

        let com_buffer  = await sharp(buffer).resize(500).png().toBuffer()  

        let obj = new model({image: com_buffer})
        await obj.save()
        return name
    }
    catch(e)
    {

        return 0        
    }
    
}

let imageuploadwithid  = async function (buffer,name) {
    try
    {
        

        let model = db.imagedb.model(name, 
                new Schema({ image: Buffer}), name);

        let com_buffer  = await sharp(buffer).resize(200).png().toBuffer()  

        let obj = new model({image: com_buffer})
        await obj.save()
        return name
    }
    catch(e)
    {

        return 0        
    }
    
}

let imagedownload = async function (name) {
    try
    {
        let model = db.imagedb.model(name, 
            new Schema({ image: Buffer}), name);

        let obj = await model.find({})
        return obj
    }
    catch(e)
    {
        return null
    }
}

module.exports = {imageupload, imagedownload, imageuploadwithid}