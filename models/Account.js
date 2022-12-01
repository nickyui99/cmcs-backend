"use strict";
const sequelize = require("../config");
const {DataTypes, Model} = require("sequelize");

class Account extends Model {
	static associate() {

	}
}

Account.init({
	acc_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	acc_email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	acc_pass: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	token: {
		type: DataTypes.STRING,
	}

}, {
	sequelize, modelName: 'account', tableName: 'account',
});


module.exports = Account;