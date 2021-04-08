const express =require("express")
const mongoose =require("mongoose")
const Messages =require("./dbMessages.js")
const Pusher =require("pusher")
const cors =require("cors")
const bodyParser =require("body-parser")
const passport =require("passport")
const users =require("./users.js")

const User = require("./User");
// import mongoose from "mongoose"
// import Messages from './dbMessages.js'
// import Pusher from 'pusher'
// import cors from 'cors'
// import bodyParser from "body-parser";

// import passport from "passport";
// import router from "./users.js";

const app = express();
const pusher = new Pusher({
    appId: "1177917",
    key: "8a303e31b3106d3f9a47",
    secret: "eeae848d6d555212f6ab",
    cluster: "ap2",
    useTLS: true
  });
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();  
// });

const con_url = 'mongodb+srv://admin:O91qZr3jMRcG4V82@cluster0.9bjhc.mongodb.net/dbMessage?retryWrites=true&w=majority';
mongoose.connect(con_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

    const db = mongoose.connection

// db.once("open", () => {
//     console.log("connected")
//     const msgCollection = db.collection("chatmohdammar10deepa007");
//     const changeStream = msgCollection.watch();

//     changeStream.on('change', (change)=>{
//         console.log(change);
//         if(change.operationType === 'insert')
//         {
//             const messageDetails = change.fullDocument;
//             pusher.trigger('messages','inserted',
//             {
//                 message: messageDetails.message, 
//                 from: messageDetails.from,
//                 to: messageDetails.to,
//                 timestamp: messageDetails.timestamp

//             }
//             )
//         }
//         else 
//         {
//             console.log("Error trigerring pusher")
//         }
//     })

// })
function setRealtime(colId)
{
    // const db = mongoose.connection
    console.log("entered",colId)
    // db.on("open", () => {
    //     console.log("connected")
        const msgCollection = db.collection(colId);
        const changeStream = msgCollection.watch();
        console.log(changeStream)
        changeStream.on('change', (change)=>{
            console.log(change);
            if(change.operationType === 'insert')
            {
                const messageDetails = change.fullDocument;
                pusher.trigger(colId,'inserted',
                {
                    message: messageDetails.message, 
                    from: messageDetails.from,
                    to: messageDetails.to,
                    timestamp: messageDetails.timestamp
    
                }
                )
            }
            else 
            {
                console.log("Error trigerring pusher")
            }
        })
    
    // })
}
// setRealtime('chatmohdammar10faisal101')

app.get("/", (req, res) => res.status(200).send("Hello world"));


// Passport middleware
app.use(passport.initialize()); 
// Passport config
require("./passport")(passport);
// Routes
app.use("/api/users", users);

// app.get('/messages/sync', (req,res) => {
//     const dbMessage = req.body  
//     console.log(dbMessage)
//     Messages.find(dbMessage, (err,data) => {
//         if(err)
//         {
//             res.status(500).send(err)
//         }
//         else 
//         {
//             res.status(200).send(data)
//         }
//     })
// })

app.post('/chat/find',(req,res) =>{
    const users = req.body
    var user2=users.username2
    var chat = `chat${users.username}${users.username2}`
    console.log(user2,chat)
    User.find({'username':users.username},'friends').then(x => {
        // if (friends) {
        //   return res.status(400).json({ username: "Username already exists or",email: "Email already exists or", phno: "Phone number already exists" });
        // } 
        // else 
        
        // {
        //   const newUser = new User({
        //     username: req.body.username,
        //     name: req.body.name,
        //     email: req.body.email,
        //     phno: req.body.phno,
        //     password: req.body.password
        //   });
        // }
        console.log(x[0].friends)
        var newfriends = (x[0].friends)
        var allfriends = []
        var arrayfriends =[]
        for(let i=0;i<newfriends.length;i++)
        {
            allfriends.push(Object.keys(newfriends[i]))
        }

        console.log(allfriends)
        for(let i of allfriends)
        {
            for(let j of i)
            {
                arrayfriends.push(j)
                console.log(j)
            }
        }
        let f=0
        for(let i in arrayfriends)
        {
            console.log(i,arrayfriends[i],user2)
            if(arrayfriends[i]===user2)
            {
                
                console.log("working :",Object.values(newfriends[i]))
                res.json({friend: 'present'})
                f=1
                break
            }
        }
        if(f==0)
        {res.json({friend: 'absent'})}


        // var friends = JSON.parse(newfriends)
        // var newfriends=[]
        // // var newfriends = friends.strip()
        // function containsObject(obj, list) {
        //     return n = list.includes(obj);
            
            // for (let i of list) {
            //     console.log(typeof(i),i);
            //     if (i == obj) {
            //         return true;
            //     }
            // }
        
                // return false;
        // }
        

        // var friend = { [users.username2]: chat}
        // var friends1 = []
        // friends1.push(friend)
        // console.log(friend)
        // console.log(typeof(friend))
        // console.log(containsObject(users.username2,friends))
        // console.log(friends1.indexOf(friend));
        // console.log(friends1.includes(friend))
        
    //     if(friends.some(f => users.username2 == )){
    //         console.log("found")
    //     } else{
    //         console.log("not")
    //     }
    })  
})


app.post('/chat/getuser',(req,res) =>{
    const users = req.body
    // var user2=users.username2
    var chat = users.chatId
    // var chat = `chat${users.username}${users.username2}`
    // console.log(user2,chat)
    User.find({'username':users.username},'friends').then(x => {
        console.log(x[0].friends)
        var newfriends = (x[0].friends)
        var allfriends = []
        var arrayfriends =[]
        for(let i=0;i<newfriends.length;i++)
        {
            allfriends.push(Object.keys(newfriends[i]))
        }

        console.log(allfriends)
        for(let i of allfriends)
        {
            for(let j of i) 
            {
                arrayfriends.push(j)
                console.log(j)
            }
        }
        console.log("arrayfriends",arrayfriends)
        console.log("newfriends",newfriends)
        var f=0
        for(let i in newfriends)
        {
            console.log(chat,"working :",Object.values(newfriends[i])[0])
        //     console.log(i,arrayfriends[i],user2)
            if(chat===Object.values(newfriends[i])[0])
            {
                
                console.log("working :",Object.values(newfriends[i]))
                res.json({friend: arrayfriends[i]})
                f=1
                break
            }
        }
        if(f==0)
        {res.json({friend: 'Loading'})}
})  
})

app.post('/group/getname',(req,res) =>{
    const data = req.body    
    var groupId = data.groupId
    var user = data.username

    User.find({'username':user},'groups').then(x => {
        console.log(x[0].groups)
        var newgroups = (x[0].groups)
        var allgroups = []
        for(let i=0;i<newgroups.length;i++)
        {
            allgroups.push(Object.values(newgroups[i])[0])
        }

        // console.log(allgroups)
        // for(let i of allgroups)
        // {
        //     for(let j of i) 
        //     {
        //         arraygroups.push(j)
        //         console.log(j)
        //     }
        // }
        console.log("arrayfriends",allgroups)
        console.log("newfriends",newgroups)
        var f=0
        for(let i in newgroups)
        {

            // done till her

            console.log("working :",groupId,Object.keys(newgroups[i]))
        //     console.log(i,arrayfriends[i],user2)
                if(groupId==Object.keys(newgroups[i]))
                {
                    
                    // console.log("working :",Object.keys(newgroups[i]))
                    res.json({group: allgroups[i]})
                    f=1
                    break
                }
        }
        if(f==0)
        {res.json({friend: 'Loading'})}
})  
})  

app.get('/messages/sync', (req,res) => {
    const dbMessage = req.body  
    console.log(dbMessage)
    Messages.find(dbMessage, (err,data) => {
        if(err)
        {
            res.status(500).send(err)
        }
        else 
        {
            res.status(200).send(data)
        }
    })
})

app.post('/chat/all',(req,res) =>{
    const users = req.body
    console.log(users)
    User.find({'username':users.username},'friends').then(x => {
        console.log(x[0].friends)
        var newfriends = (x[0].friends)
        res.status(200).send(newfriends)
        

    })  
    res.status(500)
})
app.post('/group/all',(req,res) =>{
    const users = req.body
    console.log(users)
    User.find({'username':users.username},'groups').then(x => {
        console.log(x[0].groups)
        var allgroups = (x[0].groups)
        res.status(200).send(allgroups)
        

    })  
    res.status(500)
})


app.post('/chat/realtime',async function(req,res){
    const users = req.body
    console.log(users)
    User.find({'username':users.username},'friends').then(x => {
        console.log(x[0].friends)
        var newfriends = (x[0].friends) 
        var chatcollections=[]
        for(i of newfriends){
            chatcollections.push((i[Object.keys(i)]).toLowerCase())
        }
        console.log(chatcollections)
        for(chatId of chatcollections)
            {   
                // setTimeout(outLoop, 5000, chatcollections);
                setRealtime(chatId)    
            }
        }   
    )
    User.find({'username':users.username},'groups').then(x => {
        console.log(x[0].groups)
        var newfriends = (x[0].groups) 
        var chatcollections=[]
        for(i of newfriends){
            chatcollections.push((Object.keys(i)[0]).toLowerCase())
        }
        console.log(chatcollections)
        for(chatId of chatcollections)
            {   
                console.log("INSIDE",chatId)
                // setTimeout(outLoop, 5000, chatcollections);
                setRealtime(chatId)    
            }
        }   
    )
    

    res.json({success:true})
})

app.post('/group/sync', (req,res) => {
    const groupname = req.body.roomId
    const findall ={}
    var Group =require("./Group.js")
    var group1 =  Group(groupname)

    // const mongoose = require("mongoose")

    // const chatSchema = mongoose.Schema({
    //     message: String,
    //     from: String,
    //     to: String,
    //     timestamp: String,
    // });
    // dyChat = mongoose.model(chatname,chatSchema)

    group1.find(findall, (err,data) => {
        if(err)
        {
            res.status(500).send(err)
        }
        else 
        {
            res.status(200).send(data)
        }
    })
})


app.post('/chat/sync', (req,res) => {
    const chatname = req.body.roomId
    const findall ={}
    var Chat =require("./chat.js")
    var chat1 =  Chat(chatname)

    // const mongoose = require("mongoose")

    // const chatSchema = mongoose.Schema({
    //     message: String,
    //     from: String,
    //     to: String,
    //     timestamp: String,
    // });
    // dyChat = mongoose.model(chatname,chatSchema)

    chat1.find(findall, (err,data) => {
        if(err)
        {
            res.status(500).send(err)
        }
        else 
        {
            res.status(200).send(data)
        }
    })
})

async function setFriends(user1,user2,chatname){
    const User = require("./User");
    const query = {username: user1}
    console.log(user1,user2,chatname)
    const updateDocument = { $push: {friends: {[user2]: chatname}}}
    console.log(query,updateDocument)
    const result = await User.updateOne(query, updateDocument);
    console.log(result)
    // return result
}

async function setGroups(user,groupid,groupname){
    const User = require("./User");
    const query = {username: user}
    console.log(user,groupid)
    const updateDocument = { $push: {groups: {[groupid]: groupname}}}
    console.log(query,updateDocument)
    const result = await User.updateOne(query, updateDocument);
    console.log(result)
}

app.post('/chat/check',async (req,res) =>{
    const user2 = req.body.username2
    const User = require("./User");
    const i= {}
    const friends = User.find(i,"username", (err,data) => {
        console.log(data)
        let allUsers = []
        for(x of data)
    {
        console.log(x.username)
        allUsers.push(x.username)
    }
    console.log(friends,allUsers)
    
    if(allUsers.includes(user2))
    {
        console.log("Found")
        res.status(200).send("Found")
    }
    else{
        console.log("Not Found")
        res.status(200).send("NotFound")
    }
})    
})

app.post('/group/create',(req,res) =>{
    const data = req.body
    let admin = data.admin
    let users = data.users
    let groupname = data.groupname
    console.log(data,users);

    let id = Math.random().toString(36).substring(2,10);
    let groupid=`group${id}s`;
    groupid = groupid.toLowerCase()
    console.log(id,groupid);

    const AllGroups = require("./AllGroups")
    var nothing ={admin:admin,users:users,groupid:groupid,groupname:groupname}
    // console.log(group1)
    AllGroups.create(nothing, (err,data) => {
    })
    // console.log(group1)
    
    setGroups(admin,groupid,groupname)
    for(let user of users)
    {
        setGroups(user,groupid,groupname)
    }
    
    var Group = require("./Group.js")
    var group1 =  Group(groupid)
    var nothing ={}
    group1.create(nothing, (err,data) => {
        
    })
    // console.log(group1)
    // console.log("done")
    res.status(200).send("Done")
})

app.post('/chat/create',(req,res) =>{
    const users = req.body
    let user2 = users.username2  
    // const User = require("./User");
    // const x= {}
    // const friends = User.find(x,"username")
    let chatname=`chat${users.username}${users.username2}`
    chatname = chatname.toLowerCase()
    var Chat = require("./chat.js")
    var chat1 =  Chat(chatname)
    var nothing ={}
    console.log(users)
    chat1.create(nothing, (err,data) => {
        
    })
    console.log(chat1)

    // chat1.create(alldata, (err,data) => {
    //     if(err)
    //     {
    //         res.status(500).send(err)
    //     }
    //     else 
    //     {
    //         res.status(201).send(data)
    //     }
    // })
    setFriends(users.username,user2,chatname)
    setFriends(user2,users.username,chatname)
    // const User = require("./User");
    // const query = {username: users.username}
    // const updateDocument = { $push: {friends: {[user2]: chatname}}}
    // User.updateOne(query, updateDocument);

    console.log("done")
    res.status(200).send("Done")
})

app.post('/messages/new', (req,res) => {
    const chatname = req.body.roomId
    const alldata = req.body
    var Chat =require("./chat.js")
    var chat1 =  Chat(chatname)

    chat1.create(alldata, (err,data) => {
        if(err)
        {
            res.status(500).send(err)
        }
        else 
        {
            res.status(201).send(data)
        }
    })

})

app.post('/group/messages/new', (req,res) => {
    const groupname = req.body.roomId
    const alldata = req.body
    var Group =require("./Group.js")
    var group1 =  Group(groupname)

    group1.create(alldata, (err,data) => {
        if(err)
        {
            res.status(500).send(err)
        }
        else 
        {
            res.status(201).send(data)
        }
    })

})

// app.post('/messages/new', (req,res) => {
//     const dbMessage = req.body
//     Messages.create(dbMessage, (err,data) => {
//         if(err)
//         {
//             res.status(500).send(err)
//         }
//         else 
//         {
//             res.status(201).send(data)
//         }
//     })
// })

app.listen(port, () => console.log(`Listening on localhost:${port}`));