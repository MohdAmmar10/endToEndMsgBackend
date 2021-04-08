const mongoose = require("mongoose")
var Schema  =  mongoose.Schema;

const Groups = {}
function dynamicChatSchema(groupId){
    var groupSchema = new Schema({
            message: String,
            from: String,
            to: String,
            timestamp: String,
    });     
    return mongoose.model(groupId, groupSchema);
}


// this function will store the model in the Addresses object
// on subsequent calls, if it exists, it will return it from the array
function getGroupsModel(groupId) {
    if(groupId==="one")
    {
        getallChats()
    }
    if (!Groups[groupId]) {
        Groups[groupId] =  new dynamicChatSchema(groupId)
    }
    return Groups[groupId]
  }
  function getallChats()
  {
        console.log(Groups)
  }
  

//no we export dynamicSchema function
module.exports = getGroupsModel;
