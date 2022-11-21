const connection = require("../config");
const Event = require("../models/Event");
const base64ToImage = require('base64-to-image');
const Account = require("../models/Account");
const Ngo = require("../models/Ngo");
const {Op, Sequelize, DATEONLY} = require("sequelize");
const moment = require("moment");
const {DATETIME} = require("mysql/lib/protocol/constants/types");
const Participant = require("../models/Participant");
const User = require("../models/User");


const getAllEvents = (req, res) => {

	const usrId = req.body.usrId

	Event.belongsTo(Ngo, {
		foreignKey: 'ngo_id',
		targetKey: 'ngo_id'
	})

	Event.findAll({
		attributes: [
			'event_id',
			'event_unique_id',
			'event_name',
			'description',
			'start_datetime',
			'end_datetime',
			'address',
			'lng',
			'lat',
			'image',
			'max_participant'
		],
		where: {
			end_datetime: {
				[Op.gte]: moment().toDate()
			}
		},
		order: [
			['start_datetime', "DESC"]
		],
		include: [
			{
				model: Ngo,
				required: true,
				attributes: ['ngo_name']
			},
		]
	}).then(events => {
		console.log(events)
		// console.log(events);
		res.status(200).json({events});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

const getMyEvents = (req, res) => {

	const ngoId = req.body.ngoId;

	Ngo.hasMany(Event, {
		foreignKey: 'ngo_id',
		targetKey: 'ngo_id'
	})

	Event.belongsTo(Ngo, {
		foreignKey: 'ngo_id',
		targetKey: 'ngo_id'
	})

	Event.findAll({
		attributes: [
			'event_id',
			'event_unique_id',
			'event_name',
			'description',
			'start_datetime',
			'end_datetime',
			'address',
			'lng',
			'lat',
			'image',
			'max_participant'
		],
		order: [
			['start_datetime', "DESC"]
		],
		where: {
			ngo_id: ngoId
		},
		include: [
			{
				model: Ngo,
				required: true,
			},
		]
	}).then(events => {
		console.log(events)
		// console.log(events);
		res.status(200).json({events});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}


const createEvent = (req, res) => {
	console.log(req.body)

	const eventData = {
		eventName: req.body.eventName,
		startDateTime: req.body.startDateTime,
		endDateTime: req.body.endDateTime,
		maximumParticipants: req.body.maximumParticipants,
		eventDescription: req.body.eventDescription,
		address: req.body.address,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		image: req.body.image
	}
	console.log(eventData);

	Account.hasMany(Ngo, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});

	Ngo.belongsTo(Account, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});

	Account.findOne({
		where: {
			token: req.body.token
		},
		include: {model: Ngo, required: true}
	}).then(async (acc) => {
		if (acc && acc.ngos) {

			console.log(acc.ngos[0].ngo_id);
			Ngo.hasMany(Event, {
				foreignKey: 'ngo_id',
				targetKey: 'ngo_id'
			});

			const event = await Event.create({
				ngo_id: acc.ngos[0].ngo_id,
				event_unique_id: "123",
				event_name: eventData.eventName,
				description: eventData.eventDescription,
				start_datetime: eventData.startDateTime,
				end_datetime: eventData.endDateTime,
				address: eventData.address,
				lng: eventData.longitude,
				lat: eventData.latitude,
				image: eventData.image,
				max_participant: eventData.maximumParticipants
			});
			res.status(200).json({message: "OK"});
		} else {
			res.status(404).json({message: "Account not found!"});
		}
	})
}

module.exports = {getAllEvents, getMyEvents, createEvent};
