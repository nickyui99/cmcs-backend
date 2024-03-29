"use strict";
const {sequelize} = require('../config')
const { DataTypes, Model} = require("sequelize");

class Chat extends Model {
	static associate() {
	}
}

Chat.init({
		chat_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		room_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'chat_room',
				key: 'room_id'
			}
		},
		acc_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'account',
				key: 'acc_id'
			}
		},
		message: {
			type: DataTypes.TEXT("long"),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "chat",
		tableName: "chat"
	});

module.exports = Chat;