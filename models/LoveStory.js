"use strict";
const sequelize = require('../config')
const {Sequelize, DataTypes, Model} = require("sequelize");

class LoveStory extends Model {
	static associate() {}
}

LoveStory.init({
		love_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		story_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'story',
				key: 'story_id'
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
	},
	{
		sequelize,
		modelName: "love_story",
		tableName: "love_story"
	});

module.exports = LoveStory;