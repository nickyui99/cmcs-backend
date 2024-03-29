const Ngo = require("../models/Ngo");
const Account = require("../models/Account");

/*
This function is responsible to allow NGO to register NGO account
 */
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

/*
This function is responsible to get NGO data
 */
const getNgo = (req, res) => {

	const ngoId = req.body.ngoId;
	console.log(ngoId);

	Ngo.findOne({
		attributes: ['ngo_id', 'ngo_name', 'ngo_admin', 'contact_num', 'address', 'bank_acc', 'tng_acc', 'about', 'vision', 'mission'],
		where: {
			ngo_id: ngoId
		}
	}).then(ngo => {
		console.log(ngo);
		res.status(200).json(ngo)
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to update NGO profile
 */
const updateNgo = (req, res) => {
	const ngo = {
		...req.body
	}
	Ngo.update({
			ngo_name: ngo.ngoName,
			ngo_admin: ngo.ngoAdmin,
			contact_num: ngo.contactNum,
			address: ngo.address,
			bank_acc: ngo.bankAcc,
			tng_acc: ngo.tngAcc
		},
		{
			where: {
				ngo_id: ngo.ngoId
			}
		}).then(r => {
		Account.update(
			{
				acc_image: ngo.accImg
			},
			{
				where: {
					acc_id: ngo.accId
				}
			})
		res.status(200).json({message: "ok"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

/*
This function is responsible to update NGO profile
 */
const updateNgoProfile = (req, res) => {
	const ngo = {
		...req.body
	}
	Ngo.update({
			about: ngo.about,
			vision: ngo.vision,
			mission: ngo.mission,
		},
		{
			where: {
				ngo_id: ngo.ngoId
			}
		}).then(r => {
			res.status(200).json({message: "ok"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

module.exports = {registerNgo, getNgo, updateNgo, updateNgoProfile}
