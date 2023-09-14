
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

 function dbConnect() {
    // Connect the client to the server	
    const conn = client.connect();
    if (!conn) return {error: 'Connection error'};
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
    if(!user) return {error: 'User not found'};

    return user;
   } catch (err){

    console.log("Error while getting user", err);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);


async function addUser(username){
    try {
        const collection = dbConnect();

        if (!username) return {error: 'Please provide a name'};

        const newUser = {
            name: username
        }
        const result = await collection.insertOne(newUser);
        console.log(result);
        return result;

    } catch (err) {
        console.log(err);
    } 
    finally {
        await client.close();
    }

}

async function editUser(userId, username) {
    try {
        const isUserExisting  = await getUser(userId);
        if (!isUserExisting.error) {
            const conn =  await client.connect();
            if (conn) console.log("Connected successfully to server");
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            const result = await collection.updateOne({_id: new ObjectId(userId)}, {$set: {name: username}});
            console.log(result);
            return result;
        }
    } catch (err) {
        console.log("Errro while edditing user", err)
    }
    finally {
        await client.close();
    }

}

async function deletUser(userId) {
    try {
        const collection = dbConnect();
        const isUserExisting = await getUser(userId);
        if (!isUserExisting.error) {
            const result = await collection.deleteOne({_id: new ObjectId(userId)});
            console.log(result);
            return result;
        }
        return isUserExisting.error

    } catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

module.exports = {getUser, addUser, editUser, deletUser, getCollection};

