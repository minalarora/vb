const fetch = require("node-fetch")
const app_id = "636fee50-c816-4e25-acc0-7ec8e085787f"
const token = "Basic OTE2ZWMwN2ItNzdkOS00MmQ3LWJiZjItNTRiYmRhOGI4ZmZl"


const sendNotification = function(header,body,type,array) {
    // {
    //     "app_id": "636fee50-c816-4e25-acc0-7ec8e085787f",
    //     "include_player_ids": ["e18a0d77-b548-4b78-a11d-b5cf0cabc932"],
    //     "data": {"foo": "bar"},
    //     "contents": {"en": "English Message"},
    //     "headings": {"en": "shani smoker"}
    //   }

    const obj = {}
    obj.app_id = app_id
    obj.include_player_ids = array
    obj.data = {type}
    obj.contents = {en: body}
    obj.headings = {en: header}

    try
    {
        fetch("https://onesignal.com/api/v1/notifications",{
            method: 'POST',
            headers: {
              "Content-Type":"application/json",
              "Authorization": token
            },
            body: JSON.stringify(obj)
          }).then((res)=>{
            
             //(res.status)
          }).catch((e)=>{
           //(e)
          })   
    }
    catch(e)
    {

    }

}

module.exports = {
    sendNotification
}

