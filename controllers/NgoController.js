const Ngo = require("../models/Ngo");
const Account = require("../models/Account");


const getNgo = (req, res) => {

	const ngoId = req.body.ngoId;
	console.log(ngoId);

	Ngo.findOne({
		attributes: ['ngo_id', 'ngo_name', 'ngo_admin', 'contact_num', 'address', 'bank_acc', 'tng_acc'],
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

module.exports = {getNgo, updateNgo}
