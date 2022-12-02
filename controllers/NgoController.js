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
	console.log(req.body);
	Ngo.update({
		ngo_name: req.body.ngoName,
		ngo_admin: req.body.ngoAdmin,
		contact_num: req.body.contactNum,
		address: req.body.address,
		bank_acc: req.body.bankAcc,
		tng_acc: req.body.tngAcc
	}, {
		where: {
			ngo_id: req.body.ngoId
		}

	}).then(r => {
		console.log(r)
	});
	res.status(200).json({message: "ok"});
}

module.exports = {getNgo, updateNgo}
