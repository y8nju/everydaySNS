const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path')

const account = require('../collections/accounts');
const articles = require('../collections/articles')

router.use((req, res, next) => {
	if(!req.session.authUser) {
		return res.redirect('/account/signin');
	}
	next();
})

// ======multer
const profileUpload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const uploadPath = path.join(__dirname, '..', 'static', 'images', 'user', req.session.authUser.id);
			if(!fs.existsSync(uploadPath)){
				fs.mkdirSync(uploadPath);
			}
			cb(null, uploadPath);
		},
		filename: (req, file, cb) => {
			let profileName = req.session.authUser.id + Date.now();
			cb(null, profileName);
		}
	})
})
router.route('/')
	.get((req, res) => res.redirect('user/myinfo'))
	.post((req, res) => res.redirect('user/myinfo'));

router.route('/myinfo')
	.get (async (req, res) => {
		let user = req.session.authUser;
		let postList = await articles.getByWriter(user.id);
		res.render('user/myinfo', {user, postList});
	})
	.post(profileUpload.single('profile'), async (req, res) => {
		let user = req.session.authUser;
		// 기존 이미지 삭제
		const userImage = path.join(__dirname, '..', 'static', user.image);
		if (fs.existsSync(userImage)) {
			try {
				fs.unlinkSync(userImage);
				console.log("image delete");
			} catch (error) {
				console.log(error);
			}
		}else {
			console.log('no')
		}
		// 이미지 업로드
		const url = `/images/user/${user.id}/${req.file.filename}`;
		let result = await account.updateUserImg(user.id, url);
		let postList = await articles.getByWriter(user.id);
		req.session.authUser = await account.findById(user.id);
		res.render('user/myinfo', {user : req.session.authUser, postList});
	})

router.get("/exit", (req, resp)=>{
	req.session.destroy();
	resp.redirect("/");
});

module.exports = router;