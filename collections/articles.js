const mongodb = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGODB_URI;

function connect() {
	return new mongodb.MongoClient(uri).db('everydaySns').collection("articles");
}

module.exports.add = async function(article) {
	return await connect().insertOne(article);
}

module.exports.findAll = async function() {
	return await connect().find({}).sort('createAt', -1).toArray(); 
}
module.exports.getVisibleSome = async function(userId) {
	const query = {"$or" : [{writerId : userId },  {  type : "public" } ] };
	return await connect().find(query).sort("createdAt", -1).toArray();
}

module.exports.getByWriter = async function(writerId) {
	return await connect().find({writerId : writerId }).sort("createAt", -1).toArray();
}
module.exports.findById = async function(target) {
	return await connect().findOne({_id : new mongodb.ObjectId(target)});
}
module.exports.addComment = async function(targetId, comment) {
	return await connect().updateOne(
		{_id : new mongodb.ObjectId(targetId)},
		{$push: {comments: comment}}
	);
}

module.exports.deletePost = async function(id) {
	return await connect().deleteOne({_id : new mongodb.ObjectId(id)});
}

module.exports.modifyPost = async function(id, obj) {
	return await connect().updateOne(
		{_id : new mongodb.ObjectId(id)}, 
		{$set :  {
			post: obj.message,
			type: obj.type,
			attachs: obj.attachs
		}}
	);
}