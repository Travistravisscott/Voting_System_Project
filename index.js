// Import necessary modules
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Email from "./models/form.js";
import sendEmail from "./util/sendEmail.js";
import { randomInt } from "crypto";
import Reg from "./models/register.js";
import { MongoClient } from "mongodb";
import main from "./util/sendEmail.js";
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);
// Establish MongoDB connection
mongoose.connect("mongodb://localhost:27017/VoteChain", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define __filename and __dirname variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var mainOtp; 
const Otpp = (otp)=> {
    app.get(`/Register${otp}`, (req, res) => {
        res.sendFile(path.join(__dirname, "second_page.html"));
    });
}
var gmail;
var Uid;
const Uidd = (id) => {
    app.get(`/voting${id}`, (req, res) => {
        res.sendFile(path.join(__dirname, "third-page.html"));
    });
}
var pass;

// Route to handle form submission
app.post("/submit-form", async (req, res) => {
  const { email, password } = req.body;
  pass = password;
  gmail = email;
  try {
    const formData = new Email({ email, password });
    await formData.save();
    const otp = Math.random().toString().substr(2, 6);
    Otpp(otp)
    mainOtp = otp;

    sendEmail(email, otp);
    res.redirect("/verify");
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Internal Server Error");
  }
});
var Adhar;
app.post("/register", async (req, res) => {
  const { name, dob, aadhar, password } = req.body;
  Adhar = aadhar;
  const Regisered = new Reg({ name, dob, aadhar, password });
  await Regisered.save();
  async function run() {
    try {
      await client.connect();
      const data = client.db("VoteChain");
      const ActualData = data.collection("registers");
      const latestRecord = await ActualData.find()
        .sort({ "_id": -1 })
        .limit(1)
        .toArray();
      const id = latestRecord[0]._id.toHexString();
      Uidd(id);
      Uid = id;
     sendEmail(gmail , id);
      res.redirect('/registered')

    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

});

app.post("/registered", async (req, res) => {
    const { password , UserId } = req.body;
    console.log(Uid) 
    try {
        if(Uid == UserId && pass == password) {
            res.redirect(`voting${Uid}`);
        }
       else if(Uid != UserId) {
        res.redirect("/registered")
      }
      else {
        res.redirect("/")
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app.get("/registered" , (req , res)=> {
    res.sendFile(path.join(__dirname, "second.html"));
})

app.post("/submit-form2", async (req, res) => {
  const { email, password, number } = req.body;
  try {
    if (number == mainOtp) {    
      res.redirect("/guidelines");
    } else {
        res.redirect("/verify");

    }    
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.post("/second-page.html", (req, res) => {
  res.redirect(`/Register${mainOtp}`);
});

// Route to serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

app.get("/guidelines", (req, res) => {
  res.sendFile(path.join(__dirname, "first_page.html"));
});

app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "main2.html"));
});

app.post("/votedfor", async(req,res)=> {
    const dataa = req.body["party"];
    const run = async()=> {
      try {
        await client.connect();
        const data = client.db("VoteChain");
        const Mycoll = data.collection("registers");
        const query = { aadhar : Adhar};
        const update = {$set: {party: dataa }};
        const option = { upsert:true};
        await Mycoll.updateOne(query, update, option);
        res.redirect("/thankyou")

      } finally {
        await client.close();
      }
    }
    
  
  run().catch(console.dir);

})

app.get("/thankyou" , (req, res)=> {
  app.disabled();
  res.sendFile(path.join(__dirname, "last-page.html"));
})

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
