const Alert = require("../models/Alert");
const User = require("../models/User");
const {Op, Sequelize} = require("sequelize");
const moment = require("moment/moment");

/*
This function is responsible to allow the user to create alert
 */
const createAlert = (req, res) => {
	const alert = {
		usrId: req.body.usrId,
		title: req.body.title,
		description: req.body.description,
		datetime: new Date(),
		lng: req.body.location.lng,
		lat: req.body.location.lat,
		address: req.body.location.address,
		image: req.body.image,
	};
	console.log(alert);

	Alert.create({
		usr_id: alert.usrId,
		title: alert.title,
		description: alert.description,
		datetime: alert.datetime,
		lng: alert.lng,
		lat: alert.lat,
		address: alert.address,
		image: alert.image,
	}).then(result => {
		console.log(result);
		res.status(200).json({message: "OK"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to get the user's created alert
 */
const getUserAlert = (req, res) => {
	const usrId = req.body.usrId;
	console.log(usrId);

	Alert.belongsTo(User, {
		foreignKey: 'usr_id',
		targetKey: 'usr_id'
	})

	Alert.findAll({
		where: {
			usr_id: usrId,
		},
		order: [
			['datetime', "DESC"]
		],
		include: [{
			model: User,
			required: true
		}]

	}).then(result => {
		console.log(result);
		res.status(200).json(result);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to get all the users alert
 */
const getAllAlert = (req, res) =>{
	Alert.belongsTo(User, {
		foreignKey: 'usr_id',
		targetKey: 'usr_id'
	})

	const last14Day = new Date().getDate() - 14;

	Alert.findAll({
		where:{
			datetime: {
				[Op.gte]: new Date().setDate(last14Day)
			}
		},
		order: [
			['datetime', "DESC"]
		],
		include: [{
			model: User,
			required: true
		}]

	}).then(result => {
		res.status(200).json(result);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {createAlert, getUserAlert, getAllAlert};