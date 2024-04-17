const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017';
const dbName = 'wathare';
const collectionName = 'machinewise';
const pageSize = 10;

app.get('/api/machinewise', async(req, res) => {
    try {
        const { page = 1 } = req.query;
        const pageNumber = parseInt(page);
        const skip = (pageNumber - 1) * pageSize;

        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find({}).skip(skip).limit(pageSize).toArray();

        await client.close();

        res.json({ data });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});