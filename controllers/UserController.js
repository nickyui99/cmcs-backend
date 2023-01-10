const User = require("../models/User");
const Account = require("../models/Account");
const Ngo = require("../models/Ngo");
const moment = require("moment/moment");
const Users = require("../models/User");

const registerUser = async (req, res) => {
	//retrieve data from client site
	const userInfo = {
		"accImage": req.body.accImage,
		"name": req.body.name,
		"birthdate": req.body.birthdate,
		"gender": req.body.gender,
		"contactNum": req.body.contactNum,
		"email": req.body.email,
		"password": req.body.password
	}

	console.log(userInfo);

	//query if account exist in database
	Account.findOne({
		where: {
			acc_email: userInfo.email
		}
	}).then(async acc => {

		//account already registered in database
		if (acc) {
			res.status(400).json({message: "Email address already exist."});
		} else {
			//insert new user info into 'account' and 'users' table
			const newAcc = await Account.create({
				acc_email: userInfo.email,
				acc_pass: userInfo.password,
				acc_image: null,
			})

			console.log(moment(userInfo.birthdate).format('YYYY-MM-DD HH:mm:ss'));

			const newUser = await Users.create({
				acc_id: newAcc.acc_id,
				usr_name: userInfo.name,
				birthdate: userInfo.birthdate,
				contact_num: userInfo.contactNum,
				gender: userInfo.gender,
				acc_exp: 0
			});
			res.status(200).json({message: "Account registered successfully~~"});
		}
	})
}

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

module.exports = {registerUser, getUser, updateUserProfile}
