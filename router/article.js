const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path')

const articles = require('../collections/articles');
const { ObjectId } = require('mongodb');

router.use((req, res, next) => {
	if(!req.session.authUser) {
		return res.redirect('/account/signin');
	}
	next();
})


router.route('/')
	.get((req, res) => res.redirect('article/home', {user: req.session.authUser}))

router.get('/home', async (req, res) => {
	let postList = await articles.findAll();
	postList = postList ?? [];
	postList = postList.filter(elm => {
		return elm.type === 'public' || elm.writerInfo.id == req.session.authUser.id
	})
	res.render('home', {user: req.session.authUser, postList});
});

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const uploadPath = path.join(__dirname, '..', 'static', 'images', 'post', req.session.authUser.id);
			if(!fs.existsSync(uploadPath)){
				fs.mkdirSync(uploadPath);
			}
			cb(null, uploadPath);
		},
		filename: (req, file, cb) => {
			let uploadFile = Date.now() + '_'+file.originalname;
			cb(null, uploadFile)
		}

	})
})

router.post('/upload', upload.array('attaches'), async (req, res) => {
		const user = req.session.authUser;
		const attachs = [];
		req.files.forEach (arr => {
			let url = `/images/post/${req.session.authUser.id}/${arr.filename}`;
			attachs.push(url);
		})
		const articleData = {
			writerId: user.id,
			writerName: user.name,
			writerImage: user.image,
			writerdata: new ObjectId(user._id),
			post: req.body.message,
			type: req.body.type ?? 'public',
			createAt: new Date(),
			attachs: attachs,
			comments: []
		}
		await articles.add(articleData);
		res.redirect('/article/home');
	})

router.get('/view', async (req, res) => {
	const user = req.session.authUser;
	let found = await articles.aggregateData(req.query.articleId);
	res.render('article/view', {user, found});
})

router.route('/modify')
	.get(async(req, res) => {
		const user = req.session.authUser;
		let found = await articles.aggregateData(req.query.articleId);
		res.render('article/modify', {user, found});
	})
	.post(upload.array('attaches'), async (req, res) => {
		const attachs = [];
		req.files.forEach (arr => {
			let url = `/images/post/${req.session.authUser.id}/${arr.filename}`;
			console.log(attachs.length);
			attachs.push(url);
		})
		if(attachs.length === 0 && req.body.imgFIle) {
			if(Array.isArray(req.body.imgFIle)){
				req.body.imgFIle.forEach(img => {
					attachs.push(img);
				})
			} else if (req.body.imgFIle !== undefined) {
				attachs.push(req.body.imgFIle);
			}
		}
		console.log('req.body.imgFIle', req.body.imgFIle);
		console.log('req.files', req.files);
		if(req.files.length > 0) {
			if(Array.isArray(req.body.imgFIle)) {
				let imgList = req.body.imgFIle.map(one => path.join(__dirname, '..', 'static', one) )
				for(let img of imgList) {
					fs.unlinkSync(img);
				}
			} else if(req.body.imgFIle !== undefined) {
				fs.unlinkSync(path.join(__dirname, '..', 'static', req.body.imgFIle))
			}
		}
		console.log('attachs', attachs);
		let arr = {
			_id: req.body.id,
			message: req.body.message,
			type: req.body.type ?? 'public',
			attachs: attachs,
		}
		await articles.modifyPost(req.body.id, arr);
		let found = await articles.aggregateData(req.body.id);
		const user = req.session.authUser;
		res.render('article/view', {user, found})
	})

router.get('/delete', async (req, res) => {
	let found = await articles.findById(req.query.articleId);
	if(Array.isArray(found.attachs)) {
		let imgList = found.attachs.map(one => path.join(__dirname, '..', 'static', one) )
		for(let img of imgList) {
			fs.unlinkSync(img);
		}
	} else {
		fs.unlinkSync(path.join(__dirname, '..', 'static', found.attachs))
	}
	await articles.deletePost(req.query.articleId);
	res.redirect('/article/home')

})
module.exports = router;