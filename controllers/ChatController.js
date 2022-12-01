const ChatRoom = require("../models/ChatRoom");
const {Op} = require("sequelize");
const Chat = require("../models/Chat");
const Account = require("../models/Account");
const User = require("../models/User");
const Ngo = require("../models/Ngo");
const Users = require("../models/User");

const getChatRoom = (req, res) => {
	const accId = req.body.accId;

	ChatRoom.belongsTo(Account, {
		foreignKey: "acc_id_1",
		targetKey: "acc_id"
	});
	ChatRoom.belongsTo(Account, {
		foreignKey: "acc_id_2",
		targetKey: "acc_id"
	});
	ChatRoom.hasMany(Chat, {
		foreignKey: "room_id",
		targetKey: "room_id"
	});
	Account.hasOne(Ngo, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});
	Account.hasOne(Users, {
		foreignKey: 'acc_id',
		targetKey: 'acc_id'
	});

	ChatRoom.findAll({
		where: {
			[Op.or] : {
				acc_id_1: accId,
				acc_id_2: accId
			}
		},
		include: [
			{
				model: Chat,
				limit: 1,
				order: [['created_at', 'DESC']]
			},
			{
				model: Account,
				required: true,
				attributes: ["acc_id"],
				include: [
					{
						model: Ngo,
						attributes: ["ngo_name", "contact_num"]
					},
					{
						model: User,
						attributes: ["usr_name", "contact_num"]
					}
				],
			}
		]
	}).then(room => {
		console.log(room)

		const targetIds = [];

		room.forEach((item) => {
			console.log(item)
		})

		res.status(200).json(room);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

const sendChat = (req, res) => {

	const senderId = req.body.senderId;
	const receiverId = req.body.receiverId;
	const message = req.body.message;

	ChatRoom.findOne({
		where: {
			acc_id_1: {
				[Op.or]: [
					{[Op.eq]: senderId},
					{[Op.eq]: receiverId},
				]
			},
			acc_id_2: {
				[Op.or]: [
					{[Op.eq]: senderId},
					{[Op.eq]: receiverId},
				]
			}
		}
	}).then(async room => {
		if (!room) {
			const chatRoom = await ChatRoom.create({
				acc_id_1: senderId,
				acc_id_2: receiverId,
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err})
			})
			Chat.create({
				room_id: chatRoom.room_id,
				acc_id: senderId,
				message: message,
				created_at: new Date()
			}).then(result => {
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			})


		} else {
			Chat.create({
				room_id: room.room_id,
				acc_id: senderId,
				message: message,
				created_at: new Date()
			}).then(result => {
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err})
			})
		}
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

const fetchChat = (req, res) => {
	const senderId = req.body.senderId;
	const receiverId = req.body.receiverId;
	console.log(senderId, receiverId);

	ChatRoom.findOne({
		where: {
			[Op.and]: {
				acc_id_1: {
					[Op.or]: [senderId, receiverId]
				},
				acc_id_2: {
					[Op.or]: [senderId, receiverId]
				}
			}
		}
	}).then(room => {
		console.log(room)
		if (room) {
			Chat.findAll({
				where: {
					room_id: room.room_id
				}
			}).then(chat => {
				console.log(chat)
				res.status(200).json(chat);
			})
		} else {
			res.status(202).json({message: "Chat room unfound"})
		}
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

module.exports = {getChatRoom, sendChat, fetchChat}