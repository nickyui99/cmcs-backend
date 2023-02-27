const Account = require("../models/Account");
const User = require("../models/User");
const Ngo = require("../models/Ngo");
const {Op} = require("sequelize");
const Users = require("../models/User");

const getAccountInfo = (req, res) => {

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

	Account.findAll({
		attributes: ["acc_id", "acc_image"],
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
				required: false
			},
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
				},
				required: false
			}
		]
	}).then(account => {
		console.log(account);
		res.status(200).json(account);
	}).catch(err => {
		console.log(err)
		res.status(400).json({message: err});
	});
}


module.exports = {getAccountInfo}