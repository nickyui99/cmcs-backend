"use strict";
const {sequelize} = require('../config')
const {DataTypes, Model} = require("sequelize");

class Story extends Model {
	static associate() {
	}
}

Story.init({
		story_id: {
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
		content: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		image: {
			type: DataTypes.TEXT("long"),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "story",
		tableName: "story"
	});

module.exports = Story;