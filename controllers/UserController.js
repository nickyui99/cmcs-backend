const Users = require("../models/User");

const getUser = (req, res) => {
	const usrId = req.body.usrId;
	console.log(usrId);

	Users.findOne({
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

module.exports = {getUser}
