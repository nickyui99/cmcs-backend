const Account = require("../models/Account");
const Users = require("../models/User");
const Ngo = require("../models/Ngo");
const {OAuth2Client} = require("google-auth-library");
const {CLIENT_ID} = require("../config");
const axios = require("axios");

const login = (req, res) => {
	const credentials = {
		"email": req.body.email,
		"password": req.body.password
	}

	//associate models
	Account.hasOne(Ngo, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});
	Account.hasOne(Users, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});


	Account.findOne({
		where: {
			acc_email: credentials.email,
		},
		include: [
			{model: Users},
			{model: Ngo}
		]
	}).then(account => {

		console.log(account);
		if (!account) {
			res.status(400).json({message: "Email not registered"});
		} else {
			//check if password valid
			if (credentials.password !== account.acc_pass) {
				res.status(400).json({message: "Invalid credentials"});
			} else {
				if (account.user) {  //if user update their token
					let generatedToken = new Date().getTime().toString();
					Account.update(
						{
							token: generatedToken
						},
						{
							where: {
								acc_id: account.acc_id,
							}
						});
					res.status(200).json({
						accId: account.acc_id,
						usrId: account.user.usr_id,
						accImage: account.acc_image,
						token: generatedToken,
						userType: "user"
					});
				} else if (account.ngo) { //if ngo update their token
					let generatedToken = Date.now().toString();
					Account.update({token: generatedToken}, {
						where: {
							acc_id: account.acc_id,
						}
					});
					res.status(200).json({
						accId: account.acc_id,
						ngoId: account.ngo.ngo_id,
						accImage: account.acc_image,
						token: generatedToken,
						userType: "ngo"
					});
				} else {
					res.status(400).json({message: "Account not found"});
				}
			}
		}

	})
		.catch(err => {
			console.log(err);
		});
}

const googleLogin = async (req, res) => {
	const token = req.body.token;

	await axios.post(
		`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
	).then(googleResponse => {
		console.log(googleResponse.data);
		const email = googleResponse.data.email;

		//associate models
		Account.hasOne(Ngo, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		});
		Account.hasOne(Users, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		});

		Account.findOne({
			where: {
				acc_email: email,
			},
			include: [
				{model: Users},
				{model: Ngo}
			]
		}).then(account => {

			console.log(account);
			if (!account) {
				res.status(400).json({message: "Email not registered"});
			} else {
				if (account.user) {
					Account.update(
						{
							token: token
						},
						{
							where: {
								acc_id: account.acc_id,
							}
						});
					res.status(200).json({
						accId: account.acc_id,
						usrId: account.user.usr_id,
						accImage: account.acc_image,
						token: token,
						userType: "user"
					});
				} else if (account.ngo) {
					Account.update({token: token}, {
						where: {
							acc_id: account.acc_id,
						}
					});
					res.status(200).json({
						accId: account.acc_id,
						ngoId: account.ngo.ngo_id,
						accImage: account.acc_image,
						token: token,
						userType: "ngo"
					});
				} else {
					res.status(400).json({message: "Account not found"});
				}
			}
		}).catch(err => {
			throw err;
		});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: "Invalid login"});
	})
}

const logout = (req, res) => {
	//retrieve token from client site
	const accId = req.body.accId;

	//set token to null
	Account.update(
		{
			token: null
		},
		{
			where: {
				acc_id: accId
			}
		}
	).then(data => {
		console.log(data)
	})

	res.status(200).json({message: "logout success"});
}

const isEmailRegistered = (req, res) => {
	const accEmail = req.body.accEmail;

	Account.count({
		where: {
			acc_email: accEmail
		}
	}).then(data => {
		console.log(data);
		if (data === 0) {
			res.status(200).json({emailValid: true})
		} else {
			res.status(200).json({emailValid: false})
		}
	}).catch(err => {
		res.status(400).json({message: err})
	})
}

module.exports = {login, googleLogin, logout, isEmailRegistered};
