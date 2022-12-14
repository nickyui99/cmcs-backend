const User = require("../models/User");
const Account = require("../models/Account");

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
		accId: req.body.accId,
		usrId: req.body.usrId,
		usrName: req.body.usrName,
		birthdate: req.body.birthdate,
		gender: req.body.gender,
		mobileNum: req.body.mobileNum,
		accImg: req.body.accImg
	};

	console.log(user)

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
		Account.update(
			{
				acc_image: user.accImg
			},
			{
				where: {
					acc_id: user.accId
				}
			})
		res.status(200).json({message: "ok"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {getUser, updateUserProfile}
