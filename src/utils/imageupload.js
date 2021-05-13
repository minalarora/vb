// const db = require('../db/dbfile')
const { customAlphabet }  =  require('nanoid')
const nanoid = customAlphabet('1234567890', 15)
const mongoose = require("mongoose")
var sharp = require('sharp')
var Schema = mongoose.Schema;
const AWS = require('aws-sdk');
const fs = require('fs'); // Needed for example below

const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: "UI5D4SBSNXTUMQ73PGQ3",
    secretAccessKey: "ZEIIBEd0g2HpBjgjOdjGxvmPq5efczJpGYRTr+6NQjw"
});

// mongoose.connection.on('open', function (ref) {
//     console.log('Connected to mongo server.');
//     //trying to get collection names
//     mongoose.connection.db.listCollections().toArray(function (err, names) {
//          // [{ name: 'dbname.myCollection' }]
//          names.forEach((name)=>{
//             // console.log(name.name)
//              imageuploadwithid(null,name.name)
//          })
        
//     });
// })


let imageupload  = async function (buffer) {
    try
    {
        let name = nanoid()

        // let model = db.imagedb.model(name, 
        //         new Schema({ image: Buffer}), name);

        // let com_buffer  = await sharp(buffer).resize(500).png().toBuffer()  

        // let obj = new model({image: com_buffer})
        // await obj.save()
        var params = {
            Bucket: "virtualbazaar",
            Key: name + ".png",
            Body: buffer,
            ACL: "public-read",
            Metadata: {
                        "x-amz-meta-my-key": "UI5D4SBSNXTUMQ73PGQ3"
                      }
        };
        await s3.putObject(params).promise()
        return name;
    }
    catch(e)
    {

        return 0        
    }
    
}


let imageuploadwithid  = async function (buffer,name) {
    try
    {

        // let model = db.imagedb.model(name, 
        //         new Schema({ image: Buffer}), name);

        // let com_buffer  = await sharp(buffer).resize(500).png().toBuffer()  

        // let obj = new model({image: com_buffer})
        // await obj.save()


        // let model = db.imagedb.model(name, 
        //     new Schema({ image: Buffer}), name);

        // let obj = await model.find({})
        
        var params = {
            Bucket: "virtualbazaar",
            Key: name + ".png",
            Body: buffer,
            ACL: "public-read",
            Metadata: {
                        "x-amz-meta-my-key": "UI5D4SBSNXTUMQ73PGQ3"
                      }
        };
        await s3.putObject(params).promise()
        return name;
    }
    catch(e)
    {

        return 0        
    }
    
}

let imagedownload = async function (name) {
    try
    {
        // let model = db.imagedb.model(name, 
        //     new Schema({ image: Buffer}), name);

        // let obj = await model.find({})
        // return obj
        var params = {
            Bucket: "virtualbazaar",
            Key: name + ".png",
        };
        
        let obj = await s3.getObject(params).promise();
        return obj.Body
    }
    catch(e)
    {
        return null
    }
}

module.exports = {imageupload, imagedownload, imageuploadwithid}