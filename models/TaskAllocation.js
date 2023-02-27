const {Model, DataTypes} = require("sequelize");
const {sequelize} = require("../config");

class TaskAllocation extends Model {
	static associate() {

	}
}

TaskAllocation.init({
	allocation_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	participant_id:{
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'participant',
			key: 'participant_id'
		}
	},
	task_id:{
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'task',
			key: 'task_id'
		}
	}
}, {
	sequelize,
	modelName: "task_allocation",
	tableName: "task_allocation",
});

module.exports = TaskAllocation;
