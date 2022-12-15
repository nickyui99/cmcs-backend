const Account = require("../models/Account");
const Users = require("../models/User");
const Ngo = require("../models/Ngo");
const moment = require("moment");


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
	})
		.then(account => {

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

const registerNgo = (req, res) => {
	const ngoInfo = {
		ngoName: req.body.ngoName,
		adminName: req.body.adminName,
		contactNum: req.body.contactNum,
		address: req.body.address,
		bankAcc: req.body.bankAcc,
		tngAcc: req.body.tngAcc,
		email: req.body.email,
		password: req.body.password,
	}
	console.log(ngoInfo);

	//query if account exist in database
	Account.findOne({
		where: {
			acc_email: ngoInfo.email
		}
	}).then(async acc => {
		//account already registered in database
		if (acc) {
			res.status(400).json({message: "Email address already exist. Please try again."})
		} else {
			//insert new user info into 'account' and 'users' table
			const newAcc = await Account.create({
				acc_email: ngoInfo.email,
				acc_pass: ngoInfo.password,
				acc_image: null,
			})

			console.log(newAcc);

			const newNgo = await Ngo.create({
				acc_id: newAcc.acc_id,
				ngo_name: ngoInfo.ngoName,
				ngo_admin: ngoInfo.adminName,
				contact_num: ngoInfo.contactNum,
				address: ngoInfo.address,
				bank_acc: ngoInfo.bankAcc,
				tng_acc: ngoInfo.tngAcc,
				acc_status: "approved"
			});

			res.status(200).json({message: "OK"});
		}
	})
}

const logout = (req, res) => {
	//retrieve token from client site
	const userToken = req.body.token;
	console.log(userToken);

	//set token to null
	Account.update(
		{
			token: null
		},
		{
			where: {
				acc_id: acc.acc_id
			}
		}
	).then(data => {
		console.log(data)
	})

	res.status(200).json({message: "logout success"});
}

module.exports = {login, registerUser, registerNgo, logout};
