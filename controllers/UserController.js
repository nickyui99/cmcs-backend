const User = require("../models/User");

const getUser = (req, res) => {
	const usrId = req.body.usrId;
	console.log(usrId);

	User.findOne({
		where: {
			usr_id: usrId
		}
	}).then(user => {
		console.log(user)
		res.status(200).json(user);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

const updateUserProfile = (req, res) => {
	const user = {
		usrId: req.body.usrId,
		usrName: req.body.usrName,
		birthdate: req.body.birthdate,
		gender: req.body.gender,
		mobileNum: req.body.mobileNum
	};

	User.update({
		usr_name: user.usrName,
		birthdate: user.birthdate,
		gender: user.gender,
		mobile_num: user.mobileNum,
	}, {
		where: {
			usr_id: user.usrId
		}
	}).then(result => {
		console.log(result);
		res.status(200).json({message: "ok"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {getUser, updateUserProfile}
