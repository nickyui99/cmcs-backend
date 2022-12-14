const Account = require("../models/Account");
const User = require("../models/User");
const Ngo = require("../models/Ngo");
const {Op} = require("sequelize");
const Users = require("../models/User");

const queryAccount = (req, res) => {

	const query = req.body.query;
	console.log(query)

	Account.hasOne(User, {
		foreignKey: "acc_id",
		targetKey: 'acc_id'
	});
	Account.hasOne(Ngo, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});

	//query if account exist in database
	Account.findAll({
		attributes: ["acc_id"],
		include: [
			{
				model: Ngo,
				attributes: ["ngo_id", ["ngo_name", "acc_name"], "contact_num"],
				where: {
					[Op.or]: {
						ngo_name: {
							[Op.substring]: query,
						},
						contact_num: {
							[Op.substring]: query
						}
					}
				},
			},
		]
	}).then(account => {

		Account.findAll({
			attributes: ["acc_id"],
			include: [
				{
					model: User,
					attributes: ["usr_id", ["usr_name", "acc_name"], "contact_num"],
					where: {
						[Op.or]: {
							usr_name: {
								[Op.substring]: query,
							},
							contact_num: {
								[Op.substring]: query
							}
						}
					}
				}
			]
		}).then(acc => {
			console.log(account);
			res.status(200).json([...account, ...acc]);
		}).catch(err => {
			console.log(err)
			res.status(400).json({message: err});
		})
	}).catch(err => {
		console.log(err)
		res.status(400).json({message: err});
	})
}


const getAccInfo = (req,res) => {
	const accId = req.body.accId;

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
			acc_id: accId
		},
		include: [
			{
				model: Ngo,
				attributes: ["ngo_name", "contact_num"]
			},
			{
				model: User,
				attributes: ["usr_name", "contact_num"]
			}
		],
		attributes: ["acc_id"]
	}).then(acc => {
		console.log(acc);
		res.status(200).json(acc);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

const updateAccountImage = (req, res) => {
	const accId = req.body.accId;
	const accImage = req.body.accImage;

	Account.findOne({
		where:{
			acc_id: accId,
		}
	}).then(acc => {
		if (acc) {
			Account.update({
				acc_image: accImage
			}).then(result => {
				console.log(result);
				res.status(200).statusMessage("OK");
			}).catch(err => {
				console.log(err);
				res.status(400).statusMessage("Error in changing profile picture");
			})

		} else {
			res.status(400).statusMessage("Invalid info");
		}
	})
}

module.exports = {queryAccount, getAccInfo}