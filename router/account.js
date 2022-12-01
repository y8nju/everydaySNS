const express = require('express');
const router = express.Router();
const accounts = require('../collections/accounts');

router.route('/signin')
	.get((req, res) => {
		res.render('account/signin', {msg: ''})
	})
	.post(async (req, res) => {
		let getId = await accounts.findById(req.body.id);
		console.table(getId);

		if(!getId) {
			res.render('account/signin', {msg: '⩗ 아이디가 존재하지 않습니다'})
		}else {
			if(getId.password === req.body.password) {
				req.session.authUser = getId;
				res.redirect('/article/home');
			} else {
				res.render('account/signin', {msg: '⩗ 계정과 비밀번호를 확인하세요'});
			}
		}
	})
	
router.route('/signup')
	.get((req, res) => {
		res.render('account/signup', {msg: ""})
	})
	.post(async (req, res) => {
		let birthDay = req.body.birth.split('-');
		const accuontData = {
			id: req.body.id,
			password: req.body.password,
			name: req.body.name,
			email: req.body.email,
			contact: req.body.contact,
			birth: {
				year: birthDay[0],
				month: birthDay[1],
				date: birthDay[2]
			}
		}
		let getId = await accounts.findById(req.body.id);
		if(!getId){
			await accounts.insertOne(accuontData);
			// console.table(result)
			res.render('account/signComplete', {accuontData});
		}
	})

module.exports = router;