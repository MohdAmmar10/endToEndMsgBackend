const mongoose = require("mongoose")
var Schema  =  mongoose.Schema;

const Chats = {}
function dynamicChatSchema(roomId){
    var chatSchema = new Schema({
            message: String,
            from: String,
            to: String,
            timestamp: String,
    });     
    return mongoose.model(roomId, chatSchema);
}


// this function will store the model in the Addresses object
// on subsequent calls, if it exists, it will return it from the array
function getChatsModel(roomId) {
    if(roomId==="one")
    {
        getallChats()
    }
    if (!Chats[roomId]) {
      Chats[roomId] =  new dynamicChatSchema(roomId)
    }
    return Chats[roomId]
  }
  function getallChats()
  {
        console.log(Chats)
  }
  

//no we export dynamicSchema function
module.exports = getChatsModel;
