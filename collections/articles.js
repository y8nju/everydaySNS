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
	const found = await connect().aggregate([
		{$lookup: {
			from: 'accounts',
			localField: "writerdata",
			foreignField: "_id",
			as: 'writerInfo'
		}},
		{$unwind: "$writerInfo"},
		{$sort: {createAt: -1}}
	]).toArray();
	return found;
}
module.exports.getVisibleSome = async function(userId) {
	const query = {"$or" : [{writerId : userId },  {  type : "public" } ] };
	return await connect().find(query).sort("createdAt", -1).toArray();
}

module.exports.getByWriter = async function(writerId) {
	// return await connect().find({writerId : writerId }).sort("createAt", -1).toArray();
	const found = await connect().aggregate([
		{$match:  {writerdata : new mongodb.ObjectId(writerId)}},
		{$lookup: {
			from: 'accounts',
			localField: "writerdata",
			foreignField: "_id",
			as: 'writerInfo'
		}},
		{$unwind: "$writerInfo"},
		{$sort: {createAt: -1}}
	]).toArray();
	return found;
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
module.exports.aggregateData = async function(target) {
	const found = await connect().aggregate([
		{$match:  {_id : new mongodb.ObjectId(target)}},
		{$lookup: {
			from: 'accounts',
			localField: "writerdata",
			foreignField: "_id",
			as: 'writerInfo'
		}},
		{$unwind: "$writerInfo"},
	]).next();
	return found;
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