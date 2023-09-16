
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


const dbName = 'HNGX_STAGE-TWO'
const collectionName = 'users';

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
        const conn = client.connect();
        if (!conn) return {error: 'Connection error'};
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const users = await collection.find({}).toArray();
        return users;
    } catch (err) {
        return `${err}`;
    }
    finally {
        await client.close();
    }
}
async function getUser( userId ) {
  try {
    // Connect the client to the server	
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const user = await collection.findOne({_id: new ObjectId(userId)});
    if(!user) return {error: 'User not found'};

    return user;
   } catch (err){
    return `${err}`;

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);


async function addUser(username){
    const regex = /^[a-zA-Z]+$/;
    if (!regex.test(username)) return {error: 'Please provide a valid name'};
    try {
         // Connect the client to the server	
        await  client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        if (!username) return {error: 'Please provide a name'};

        const newUser = {
            name: username
        }
        const result = await collection.insertOne(newUser);
        if (result.insertedCount === 0) {
            return {error: 'User not added'}
        }

        console.log(result);
        return {message: 'User added successfully'};

    } catch (err) {
        console.log(err);
        return `${err}`;
    } 
    finally {
        await client.close();
    }

}

async function editUser(userId, username) {
    try {
        const isUserExisting  = await getUser(userId);
        if (!isUserExisting.error) {

            const regex = /^[a-zA-Z]+$/;
            if (!regex.test(username)) return {error: 'Please provide a valid name'};

            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const result = await collection.updateOne({_id: new ObjectId(userId)}, {$set: {name: username}});
            if (result.modifiedCount === 0) {
                return {error: 'User not found'}
            }

            return {message: 'User updated successfully'};
        }
        return isUserExisting.error;
    } catch (err) {
        console.log("Errro while edditing user", err)
        return `${err}`;
    }
    finally {
        await client.close();
    }

}

async function deletUser(userId) {
    try {
        const isUserExisting = await getUser(userId);
        if (!isUserExisting.error) {
           // const collection = await dbConnect();
            await client.connect();
            const db = client.db(dbName);
            
            const collection = db.collection(collectionName);
            const result = await collection.deleteOne({_id: new ObjectId(userId)});
            if (result.deletedCount === 0) {
                return {error: 'User not found'}
            }
            return {message: 'User deleted successfully'};
        }
        return isUserExisting.error

    } catch (err) {
        console.log(err);
        return `${err}`;
    }
    finally {
        await client.close();
    }
}

module.exports = {getUser, addUser, editUser, deletUser, getCollection};

