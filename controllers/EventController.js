const Event = require("../models/Event");
const Ngo = require("../models/Ngo");
const {Op, Sequelize, QueryTypes} = require("sequelize");
const moment = require("moment");
const Participant = require("../models/Participant");
const Task = require("../models/Task");
const TaskAllocation = require("../models/TaskAllocation");
const {query} = require("express");
const User = require("../models/User");

/*
This function is responsible to get all the events
 */
const getAllEvents = (req, res) => {

	const usrId = req.body.usrId

	Event.belongsTo(Ngo, {
		foreignKey: 'ngo_id',
		targetKey: 'ngo_id'
	})

	Event.findAll({
		attributes: [
			'event_id',
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
			['end_datetime', "DESC"]
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

/*
This function is responsible to allow NGO to get the event they created
 */
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
			'event_name',
			'description',
			'start_datetime',
			'end_datetime',
			'address',
			'lng',
			'lat',
			'image',
			'max_participant',
			'trash_collected'
		],
		order: [
			['end_datetime', "DESC"]
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

/*
This function is responsible to get the event information
 */
const getEventInfo = (req, res) => {

	console.log("getEventInfo run")
	const eventId = req.body.eventId;

	Event.belongsTo(Ngo, {
		foreignKey: 'ngo_id',
		targetKey: 'ngo_id'
	})

	Event.findOne({
		attributes: [
			'event_id',
			'event_name',
			'description',
			'start_datetime',
			'end_datetime',
			'address',
			'lng',
			'lat',
			'image',
			'max_participant',
			'trash_collected'
		],
		order: [
			['start_datetime', "DESC"]
		],
		where: {
			event_id: eventId
		},
		include: [
			{
				model: Ngo,
				required: true,
				attributes: ['ngo_name']
			},
		]
	}).then(async events => {

		async function fetchParticipantData() {
			const participantData = await Participant.findAll({
				attributes: [
					[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
					[Sequelize.fn('COUNT', Sequelize.col('createdAt')), 'count']
				],
				where: {
					createdAt: {
						[Op.gte]: moment().subtract(7, 'days').toDate(),
						[Op.lte]: moment().toDate()
					},
					status: 1,
					event_id: events.event_id
				},
				group: 'date'
			});

			return participantData;
		}

		async function fetchGenderData(){
			Participant.belongsTo(User, {
				foreignKey: 'usr_id',
				targetKey: 'usr_id'
			});

			const genderData = await Participant.findAll({
				attributes: [
					[Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
					[Sequelize.literal('user.gender'), 'gender']
				],
				where: {
					event_id: events.event_id,
					status: 1
				},
				group: 'gender',
				include: [
					{
						model: User,
						required: true,
						attributes: []
					},
				],
				raw: true
			});

			console.log(genderData);

			return genderData;
		}

		Promise.all([
			fetchParticipantData(),
			fetchGenderData()
		])
		.then(([participantData, genderData]) => {
			res.status(200).json({events, participantData, genderData})
		}).catch(err => {
			console.log(err);
			res.status(400).json({message: err});
		})



	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

/*
This function is responsible to allow the NGO to create event
 */
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

	Ngo.findOne({
		where: {
			ngo_id: req.body.ngoId
		},
	}).then(async (ngo) => {
		if (ngo) {

			console.log(ngo.ngo_id);

			const event = await Event.create({
				ngo_id: ngo.ngo_id,
				event_name: eventData.eventName,
				description: eventData.eventDescription,
				start_datetime: eventData.startDateTime,
				end_datetime: eventData.endDateTime,
				address: eventData.address,
				lng: eventData.longitude,
				lat: eventData.latitude,
				image: eventData.image,
				max_participant: eventData.maximumParticipants,
				trash_collected: 0,
				viewer: 0
			});
			res.status(200).json({message: "OK"});
		} else {
			res.status(404).json({message: "Account not found!"});
		}
	})
}

/*
This function is responsible to allow NGO to update the event
 */
const updateEvent = (req, res) => {
	console.log(req.body)

	const eventData = {
		eventId: req.body.eventId,
		eventName: req.body.eventName,
		startDateTime: req.body.startDateTime,
		endDateTime: req.body.endDateTime,
		maximumParticipants: req.body.maximumParticipants,
		eventDescription: req.body.eventDescription,
		image: req.body.image
	}
	console.log(eventData);

	Event.findOne({
		where: {
			event_id: req.body.eventId
		},
	}).then(event => {
		if (event) {
			Event.update({
				event_name: eventData.eventName,
				description: eventData.eventDescription,
				start_datetime: eventData.startDateTime,
				end_datetime: eventData.endDateTime,
				image: eventData.image,
				max_participant: eventData.maximumParticipants
			}, {
				where: {
					event_id: eventData.eventId
				}
			}).then(result => {
				console.log(result);
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			});

		} else {
			res.status(400).json({message: "Event not found!"});
		}
	})
}

/*
This function is responsible to allow the NGO to update the achievement
 */
const updateAchievement = (req, res) => {
	console.log(req.body)

	const eventId = req.body.eventId;
	const trashCollected = req.body.trashCollected;

	Event.findOne({
		where: {
			event_id: eventId
		},
	}).then(event => {
		if (event) {
			Event.update({
				trash_collected: trashCollected
			}, {
				where: {
					event_id: eventId
				}
			}).then(result => {
				console.log(result);
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			});

		} else {
			res.status(400).json({message: "Event not found!"});
		}
	})
}

/*
This function is to allow the NGO to cancel the event
 */
const cancelEvent = (req, res) => {
	const eventId = req.body.eventId;

	Task.hasMany(TaskAllocation, {
		foreignKey: "task_id",
		targetKey: "task_id"
	});

	Task.belongsTo(Event, {
		foreignKey: "event_id",
		targetKey: "event_id"
	});

	Task.findOne({
		where: {
			event_id: eventId
		},
		include: [
			{
				model: TaskAllocation,
				attributes: ["allocation_id"],
				raw: true,
			}
		]
	}).then(task => {

		if (task) {
			//deleting task allocation
			task.task_allocations.forEach(item => {
				TaskAllocation.destroy({
					where: {
						allocation_id: item.dataValues.allocation_id,
					}
				}).catch(err => {
					console.log(err);
					res.status(400).json({message: err});
				})
			});

			//deleting task
			Task.destroy({
				where: {
					task_id: task.task_id
				}
			}).then(result => {
				console.log(result);
			}).catch(err => {
				console.log(err)
				res.status(400).json({message: err});
			})
		}

		Participant.destroy({
			where: {
				event_id: eventId,
			}
		}).catch(err => {
			console.log(err)
			res.status(400).json({message: err});
		})

		//deleting event
		Event.destroy({
			where: {
				event_id: eventId,
			}
		}).then(result => {
			console.log(result);
			res.status(200).json({message: "OK"});
		}).catch(err => {
			console.log(err)
			res.status(400).json({message: err});
		})

	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {getAllEvents, getMyEvents, getEventInfo, createEvent, updateEvent, cancelEvent, updateAchievement};