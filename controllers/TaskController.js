const Task = require("../models/Task");
const TaskAllocation = require("../models/TaskAllocation");
const Participant = require("../models/Participant");
const User = require("../models/User");
const {Op} = require("sequelize");

/*
This function is responsible to get the event's task
 */
const getEventTask = (req, res) => {
	const eventId = req.body.eventId;

	Task.hasMany(TaskAllocation, {
		foreignKey: 'task_id',
		targetKey: 'task_id'
	})

	Task.findAll({
		where: {
			event_id: eventId
		},
		include: [
			{
				model: TaskAllocation,
			}
		]
	}).then(tasks => {
		console.log(tasks)
		res.status(200).json({tasks});
	}).catch(err => {
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to allow NGO to add event task
 */
const addEventTask = async (req, res) => {
	const eventId = req.body.eventId;
	const taskName = req.body.taskName;

	const task = await Task.create({
		event_id: eventId,
		task_name: taskName
	}).then(result => {
		res.status(200).json({message: result});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to get participant assigned task
 */
const getParticipantTask = (req, res) => {
	const participantId = req.body.participantId;
	const eventId = req.body.eventId;

	Task.hasMany(TaskAllocation, {
		foreignKey: "task_id",
		targetKey: "task_id",
	})

	Task.findAll({
		where: {
			event_id: eventId,
		},
		include: [
			{
				model: TaskAllocation,
				where: {
					participant_id: participantId
				}
			}
		]
	}).then(task => {
		res.status(200).json({task});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to allow NGO to allocate task to the participant
 */
const allocateTask = (req, res) => {

	const taskId = req.body.taskId;
	const participantId = req.body.participantId;

	TaskAllocation.findOne({
		where: {
			task_id: taskId,
			participant_id: participantId
		}
	}).then(PIC => {
		console.log(PIC)
		if(PIC === null) {
			TaskAllocation.create({
				task_id: taskId,
				participant_id: participantId
			}).then(result => {
				res.status(200).json({message: result});
			})
		}else {
			res.status(400).json({message: "The participant already assigned to this task!!"});
		}
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

/*
This function is responsible to allow NGO to remove assigned task from the participant
 */
const removeTask = (req, res) => {

	const taskId = req.body.taskId;
	const participantId = req.body.participantId;

	TaskAllocation.findOne({
		where: {
			task_id: taskId,
			participant_id: participantId
		}
	}).then(PIC => {
		console.log(PIC)
		if(PIC) {
			TaskAllocation.destroy({
				where: {
					task_id: taskId,
					participant_id: participantId
				}
			}).then(result => {
				res.status(200).json({message: result});
			})
		}else {
			res.status(400).json({message: "Invalid participant information!!"});
		}
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {getEventTask, addEventTask, allocateTask, getParticipantTask, removeTask}