const Participant = require("../models/Participant");
const {Op} = require("sequelize");
const User = require("../models/User");
const TaskAllocation = require("../models/TaskAllocation");


const joinEvent = (req, res) => {

	const data = req.body;
	console.log(data)

	Participant.findOne({
		where: {
			event_id: data.eventId,
			usr_id: data.usrId,
		}
	}).then(participant => {
		if (participant) {
			res.status(400).json({message: "Invalid participant"})
		} else {
			Participant.create({
				event_id: data.eventId,
				usr_id: data.usrId,
				attendance: false,
				status: false
			}).then(() => {
				res.status(200).json({message: "OK"});
			}).catch((err) => {
				res.status(400).json({message: err});
			})
		}
	})
}

const getParticipants = (req, res) => {
	const eventId = req.body.eventId;
	const query = req.body.query;

	Participant.belongsTo(User, {
		foreignKey: 'usr_id',
		targetKey: 'usr_id'
	})

	Participant.findAll({
		where: {
			event_id: eventId,
			status: true,
		},
		include: [
			{
				model: User,
				required: true,
				where: {

					usr_name: {
						[Op.like]: `%${query}%`
					}
				}
			}
		]
	}).then(participants => {
		console.log(participants);
		res.status(200).json({participants})
	}).catch(err => {
		console.log(err)
		res.status(200).json({message: "OK"})
	})
}

const joinRequests = (req, res) => {
	console.log(req.body)
	const eventId = req.body.eventId;
	const query = req.body.query;

	Participant.belongsTo(User, {
		foreignKey: 'usr_id',
		targetKey: 'usr_id'
	})

	Participant.findAll({
		where: {
			event_id: eventId,
			status: false
		},
		include: [
			{
				model: User,
				required: true,
				where: {
					usr_name: {
						[Op.like]: `%${query}%`
					}
				}
			}
		]
	}).then(participants => {
		console.log(participants);
		res.status(200).json({participants})
	}).catch(err => {
		console.log(err)
		res.status(200).json({message: "OK"})
	})
}

const deleteParticipant = (req, res) => {
	const usrId = req.body.usrId;
	const eventId = req.body.eventId;

	Participant.findOne({
		where: {
			usr_id: usrId,
			event_id: eventId
		}
	}).then(participant => {
		TaskAllocation.destroy({
			where: {
				participant_id: participant.participant_id,
			}
		}).then(result => {
			Participant.destroy({
				where: {
					usr_id: usrId,
					event_id: eventId
				}
			}).then(participant => {
				console.log(participant);
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			})
		})
	})
}

const eventCapacity = (req, res) => {
	const eventId = req.body.eventId;
	Participant.count({
		where: {
			event_id: eventId
		}
	}).then((count) => {
		console.log(count);
		res.status(200).json({participantCount: count})
	})
}


const getParticipantInfo = (req, res) => {
	const usrId = req.body.usrId;
	const eventId = req.body.eventId;

	Participant.findOne({
		where: {
			usr_id: usrId,
			event_id: eventId
		}
	}).then(participant => {
		console.log(participant)
		res.status(200).json({participant});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

const approveRequest = (req, res) => {
	const participantId = req.body.participantId;

	Participant.update(
		{status: true},
		{
			where: {
				participant_id: participantId
			}
		}
	).then(result => {
		console.log(result);
		res.status(200).json({message: "OK"})
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

module.exports = {
	joinEvent,
	deleteParticipant,
	eventCapacity,
	getParticipants,
	joinRequests,
	approveRequest,
	getParticipantInfo
}