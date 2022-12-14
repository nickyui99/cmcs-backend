const ChatRoom = require("../models/ChatRoom");
const {Op} = require("sequelize");
const Chat = require("../models/Chat");
const Account = require("../models/Account");
const User = require("../models/User");
const Ngo = require("../models/Ngo");
const Users = require("../models/User");

const getChatRoom = (req, res) => {
	const accId = req.body.accId;
	console.log(accId)

	ChatRoom.hasMany(Chat, {
		foreignKey: 'room_id',
		targetKey: 'room_id'
	})

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
			[Op.or]: {
				acc_id_1: accId,
				acc_id_2: accId
			}
		},
		include: [
			{
				model: Chat,
				order: [['created_at', 'DESC']],
			},
		]
	}).then(room => {
		const targetIds = room.map(item => {
			let targetId = item.acc_id_1 === accId ? item.getDataValue("acc_id_2") : item.getDataValue("acc_id_1");
			return targetId;
		});

		console.log(targetIds)

		Account.findAll({
			where: {
				acc_id: {
					[Op.or] : targetIds
				}
			},
			raw: true,
			nest: true,
			include: [
				{
					model: User,
					attributes: [["usr_name", "acc_name"], "contact_num"]
				},
				{
					model: Ngo,
					attributes: [["ngo_name", "acc_name"], "contact_num"]
				}
			]
		}).then(acc => {
			console.log(acc)
			let dataCounter = 0;
			const roomList = room.map(item => {

				const data =  {
					room_id: item.getDataValue("room_id"),
					chats: item.getDataValue("chats"),
					target_acc: {
						acc_id: acc[dataCounter].acc_id,
						acc_name: acc[dataCounter].ngo.acc_name ? acc[dataCounter].ngo.acc_name : acc[dataCounter].user.acc_name,
						acc_image: acc[dataCounter].acc_image,
						contact_num: acc[dataCounter].ngo.contact_num ? acc[dataCounter].ngo.contact_num : acc[dataCounter].user.contact_num
					}
				}
				dataCounter++;
				return data;
			});
			console.log(roomList);

			res.status(200).json(roomList);
		}).catch(err => {
			console.log(err)
			res.status(400).json({message: err});
		})
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