const express =require("express")
const mongoose =require("mongoose")
const Messages =require("./dbMessages.js")
const Pusher =require("pusher")
const cors =require("cors")
const bodyParser =require("body-parser")
const passport =require("passport")
const users =require("./users.js")
const chat =require("./chat.js")
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

db.once("open", () => {
    console.log("connected")
    const msgCollection = db.collection("msgcontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change)=>{
        console.log(change);
        if(change.operationType === 'insert')
        {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message, 
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            }
            )
        }
        else 
        {
            console.log("Error trigerring pusher")
        }
    })

})


app.get("/", (req, res) => res.status(200).send("Hello world"));


// Passport middleware
app.use(passport.initialize()); 
// Passport config
require("./passport")(passport);
// Routes
app.use("/api/users", users);

app.get('/messages/sync', (req,res) => {
    const dbMessage = req.body  
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

app.post('/chat/find',(req,res) =>{
    const uname = req.body
    
})

app.post('/chat/create',(req,res) =>{
    const users = req.body
    console.log(users)
    const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
    message: String,
    from: String,
    to: String,
    timestamp: String,
});
 Chat = mongoose.model(`chat${users.username}${users.username1}`,chatSchema)
 Chat.create(req.body, (err,data) => {
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

app.post('/messages/new', (req,res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err,data) => {
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

app.listen(port, () => console.log(`Listening on localhost:${port}`));