const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const accounts = require('../collections/accounts');
const articles = require('../collections/articles');

router.get("/idCheck", async(req, res) => {
	let found = await accounts.findById(req.query.id);
	console.log(req.query.id)
	const obj = {};
	if(found) {
		obj.success = false;
	}else {
		obj.success = true;
	}
	res.json(obj);
})

router.post('/comment' , async(req, res) => {
	let targetId = req.body.targetId; // 현재 게시글 _id
	console.log(targetId);
	let commentId = uuid.v4().split('-')[0];
	let comment = {
		_id: commentId,
		commenterId : req.session.authUser.id,
		commneterName: req.session.authUser.name,
		commneterImage: req.session.authUser.image,
		commnetMessage: req.body.message,
		createdAt: new Date()
	}
	await articles.addComment(targetId, comment);
	let found = await articles.findById(targetId);
	let obj = {
		success: true,
		comment: found.comments
	}
	res.json(obj);
})

module.exports = router;