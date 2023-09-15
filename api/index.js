const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dbConn = require('./dbConn');



app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://JasonAdmin:Jack2000@cluster0.qkqu6un.mongodb.net/?retryWrites=true&w=majority";

// const uri = "mongodb://127.0.0.1:27017/";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// get all users -working
app.get('/api', async (req, res) => {
    res.send(await dbConn.getCollection());
})

// get one user using id -working
app.get('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    res.json(await dbConn.getUser(userId))
})

// add a user -working
app.post('/api', async (req, res) => {
    const username = req.query.person;
    res.json(await dbConn.addUser(username));
})

// edit a user -working
app.put('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    const username = req.query.person;
    res.json(await dbConn.editUser(userId, username))
});


// delete a user
app.delete('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    res.json(await dbConn.deletUser(userId))
});


async function run() {
    const conn =  await client.connect( err => {
        if(err) { console.error(err); return err;}
        // connection to mongo is successful, listen for requests

    })
    app.listen(port, () => {
        console.log(`The server is live at http://localhost:${port}/api`);
    
    });
}

run().catch(console.dir);
