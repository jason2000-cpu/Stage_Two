const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dbConn = require('./dbConn');



app.use(cors());
app.use(express.json());

app.get('/api', async (req, res) => {
    res.send(await dbConn.getCollection());
})

app.get('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    res.json(await dbConn.getUser(userId))
})

app.post('/api/', async (req, res) => {
    const username = req;
    console.log(req.body)
    // console.log(username)
    res.json("<h1>HELLO WORLD!</h1>");
})

app.put('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    res.json(await dbConn.editUser(userId))
});

app.delete('/api/:userId', async (req, res) => {
    const userId = req.params.userId;
    res.json(await dbConn.deletUser(userId))
});


app.listen(port, () => {
    console.log(`The server is live at http://localhost:${port}/api`);

})
