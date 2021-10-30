//importing modules
const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const Model = require("./dbModel.js");
const userModel = require("./userModel.js")
const Pusher = require("pusher");
const cors = require("cors");
const LocalStorage = require("node-localstorage").LocalStorage;

//creating localstorage instance
// const localStorage = new LocalStorage('./scratch');
var userData = {
 name: '',
 email: '',
 profile: ''
};

//server configuration
const server = express();
const port = process.env.PORT;
const pusher = new Pusher({
 appId: "1282554",
 key: "4f79555c3080807b1d69",
 secret: "b040e6633a86f0d4cd30",
 cluster: "ap2",
 useTLS: true
})

//middleware
server.use(express.json());
server.use(cors());
server.use((req, res, next) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Headers", "*");
 next();
})

//db connection
const conUrl = "mongodb+srv://parbat:pO1bMMBtbthSeGEl@cluster0.nif1f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(conUrl, {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
const db = mongoose.connection;
db.once('open', () => {
 console.log("Database connected !!")
 const MsgCollection = db.collection('messagecontents');
 const changeStream = MsgCollection.watch();
 changeStream.on("change", (change) => {
  if (change.operationType === 'insert') {
   const messageDetails = change.fullDocument;
   console.log(messageDetails)
   console.log(`${change.operationType} event triggered!!`)
   pusher.trigger('messagecontents', 'inserted', messageDetails);

  } else {
   console.log(`${change.operationType} event triggered!!`)
  }
 })

})
// <------ api routes ------->
// server.get("/", (req, res) => {
//  res.end("Server Started .");
// })

//reading message
server.get("/getMessage", (req, res) => {
 Model.find((err, data) => {
  if (err) {
   res.status(500).send(err)
  } else {
   res.status(200).send(data)
  }
 })
})

//posting message
server.post("/sendMessage", (req, res) => {
 const message = req.body;
 // insert data into database
 Model.create(message, (err, data) => {
  if (err) {
   res.status(500).send(err);
  } else {
   res.status(200).send(message);
  }
 })
})

//creating a new user
server.post("/createNewUser", (req, res) => {
 userData = req.body;
 // check if user already exist or not !!
 userModel.find({ email: userData.email }, async (err, docs) => {
  if (docs.length > 0) {
   res.status(200).send({ message: "Login successfull", created: false, data: userData });
  } else {
   userModel.create(userData, (err, data) => {
    if (err) {
     res.status(500).send(err);
    } else {
     res.status(200).send({ message: "Registered successfull", created: true, data: userData });
    }
   })
  }
 })
})

//sending userdata
server.get("/userData", (req, res) => {
 res.status(201).send(JSON.parse(localStorage.getItem("userData")))
})

//sending users list
server.get("/getUser", (req, res) => {
 userModel.find((err, data) => {
  if (err) {
   res.status(500).send(err)
  } else {
   res.status(200).send(data)
  }
 })
})

//heroku hosting
const dir = __dirname.slice(0, 37) + "/frontend/build/";
if (process.env.NODE_ENV === "production") {
 server.use(express.static(dir))
 server.get("*", (req, res) => {
  res.sendFile(path.join(dir,"/index.html"))
 })
} else {
 server.use("/", (req, res) => {
  res.send("Server oo started...")
 })
}

//listening
server.listen(port, () => {
 console.log(`Listening to the port ${port}`);
})