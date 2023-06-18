const mongodb = require('mongodb');
const winston = require('winston');

// Database connection
var db;
module.exports = {
    connectMongoDB: async () => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient(process.env.MONGO_CONNECT_STRING, { useNewUrlParser: true });
        client.connect(err => {
            db = client.db("jiteradb");
        });
    },
    getDB: function () {
        return db
    }
}