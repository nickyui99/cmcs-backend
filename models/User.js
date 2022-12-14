"use strict";
const sequelize = require('../config')
const {Sequelize, DataTypes, Model} = require("sequelize");
const Account = require("./Account");

class User extends Model {
	static associate() {}
}

User.init({
		usr_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		acc_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'account',
				key: 'acc_id'
			}
		},
		usr_name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		birthdate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		contact_num: {
			type: DataTypes.STRING(15),
			allowNull: false,
		},
		gender: {
			type: DataTypes.STRING(15),
			allowNull: false,
		},
		acc_exp: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	},
	{
		sequelize,
		modelName: "user",
		tableName: "user"
	});

module.exports = User;