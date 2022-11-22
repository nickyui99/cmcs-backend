const connection = require("../config");
const Account = require("../models/Account");
const Users = require("../models/User");
const sequelize = require("../config");
const Ngo = require("../models/Ngo");


const login = (req, res) => {
	const credentials = {
		"email": req.body.email,
		"password": req.body.password
	}

	console.log(credentials);

	//associate models
		Account.hasMany(Ngo, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		});
		Account.hasMany(Users, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		});

		Users.belongsTo(Account, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		});

		Ngo.belongsTo(Account, {
			foreignKey: 'acc_id',
			targetKey: 'acc_id'
		})

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
			if(!account) {
				res.status(404).json({message: "Email not registered"});
			}
			else{
				//check if password valid
				if (credentials.password !== account.acc_pass) {
					res.status(401).json({message: "Invalid credentials"});
				} else {
					if(account.users.length !== 0){  //if user update their token
						let generatedToken = Date.now().toString();
						Account.update({token: generatedToken}, {
							where: {
								acc_id: account.acc_id,
							}
						});
						res.status(200).json({accId: account.acc_id, usrId: account.users[0].usr_id, token: generatedToken, userType: "user"});
					} else if (account.ngos.length !== 0) { //if ngo update their token
						let generatedToken = Date.now().toString();
						Account.update({token: generatedToken}, {
							where: {
								acc_id: account.acc_id,
							}
						});
						res.status(200).json({accId: account.acc_id, ngoId: account.ngos[0].ngo_id, token: generatedToken, userType: "ngo"});
					} else {
						res.status(404).json({message: "Account not found"});
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
		"name": req.body.name,
		"birthdate": req.body.birthdate,
		"gender": req.body.gender,
		"mobileNumber": req.body.mobileNum,
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
		if(acc) {
			res.status(400).json({message: "Email address already exist."})
		}
		else {
			//insert new user info into 'account' and 'users' table
			const newAcc = await Account.create({
				acc_email: userInfo.email,
				acc_pass: userInfo.password
			})

			console.log(newAcc);

			const newUser = await Users.create({
				acc_id: newAcc.acc_id,
				usr_name: userInfo.name,
				birthdate: userInfo.birthdate,
				mobile_num: userInfo.mobileNumber,
				gender: userInfo.gender,
				total_hrs_volunteered: 0,
				project_participated: 0,
				acc_exp: 0
			});
			res.status(200).json({message: "Account registered successfully~~"})
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
		if(acc) {
			res.status(400).json({message: "Email address already exist. Please try again."})
		}
		else {
			//insert new user info into 'account' and 'users' table
			const newAcc = await Account.create({
				acc_email: ngoInfo.email,
				acc_pass: ngoInfo.password
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
				hrs_of_service: 0,
				trash_collected: 0,
				acc_status: "approved"
			});
		}
	})
}

const logout = (req, res) => {
	//retrieve token from client site
	const userToken = req.body.token;
	console.log(userToken);

	//query if account exist in database
	Account.findOne({
		where: {
			token: userToken
		}
	}).then(async acc => {

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
	})


	res.status(200).json({message: "logout success"});
}

module.exports = {login, registerUser, registerNgo, logout};