"use strict";
const sequelize = require('../config')
const {Sequelize, DataTypes, Model} = require("sequelize");

class ChatRoom extends Model {
	static associate() {}
}

ChatRoom.init({
		room_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		acc_id_1: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'account',
				key: 'acc_id'
			}
		},
		acc_id_2: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'account',
				key: 'acc_id'
			}
		},
	},
	{
		sequelize,
		modelName: "chat_room",
		tableName: "chat_room"
	});

module.exports = ChatRoom;
