
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://JasonAdmin:Jack2000@cluster0.qkqu6un.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const collectionName = 'HNGX_STAGE-TWO'
const dbName = 'users';
const users =[
    {
        id: 1,
        name: 'Jason',
    },
    {
        id: 2,
        name: 'Jack',
    },
    {
        id: 3,
        name: 'Jude',
    }
]

 function dbConnect() {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
}


async function getCollection() {
    try {
        const collection = dbConnect();
        const users = await collection.find({}).toArray();
        console.log(users);
        return users;
    } catch (err) {
        console.log(err)
    }
    finally {
        await client.close();
    }
}
async function getUser( userId ) {
  try {
    const  collection =  dbConnect();
    const user = await collection.findOne({_id: new ObjectId(userId)});
    console.log(user)
    return user;


  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);


async function addUser(username){
    const collection = dbConnect();
    const result = await collection.insertOne({name: username});
    console.log(result);
    return result;

}

async function editUser(userId) {
    const collection = dbConnect();;
    const result = await collection.updateOne({id: userId}, {$set: {name: username}})
    return result;
}

async function deletUser(userId) {
    const collection = dbConnect();
    const result = await collection.deleteOne({id: userId});
    console.log(result);
    return result;
}

module.exports = {getUser, addUser, editUser, deletUser, getCollection};

