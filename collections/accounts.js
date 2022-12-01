const mongodb = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGODB_URI;

function connect() {
	return new mongodb.MongoClient(uri).db('everydaySns').collection("accounts");
}

async function insertOne(doc) {
	return await connect().insertOne(doc);
}

async function findAll() {
	return await connect().find().toArray(); 
}

async function findById(target) {
    return await connect().findOne({id : target});
}

async function updateUserImg(userId, url) {
	return await connect().updateOne(
		{id: userId}, 
		{$set: {image: url}}
	);
}
module.exports = {
	insertOne, findAll, findById, updateUserImg
};