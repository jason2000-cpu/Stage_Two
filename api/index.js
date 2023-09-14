const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dbConn = require('./dbConn');



app.use(cors());
app.use(express.json());


// get all users
app.get('/api', async (req, res) => {
    res.send(await dbConn.getCollection());
})

// get one user using id
app.get('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    res.json(await dbConn.getUser(userId))
})

// add a user
app.post('/api', async (req, res) => {
    const username = req.body.person;
    console.log(req.body)
    // console.log(username)
    res.json(await dbConn.addUser(username));
})

// edit a user
app.put('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    const username = req.body.person;
    res.json(await dbConn.editUser(userId, username))
});


// delete a user
app.delete('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    res.json(await dbConn.deletUser(userId))
});


app.listen(port, () => {
    console.log(`The server is live at http://localhost:${port}/api`);

})
