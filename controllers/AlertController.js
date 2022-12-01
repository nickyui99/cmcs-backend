const Alert = require("../models/Alert");
const User = require("../models/User");
const {Op, Sequelize} = require("sequelize");
const moment = require("moment/moment");

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

const getAllAlert = (req, res) =>{
	Alert.belongsTo(User, {
		foreignKey: 'usr_id',
		targetKey: 'usr_id'
	})

	const last7Day = new Date().getDate() -7


	Alert.findAll({
		where:{
			datetime: {
				[Op.gte]: new Date().setDate(last7Day)
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