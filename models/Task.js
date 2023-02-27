const {sequelize} = require("../config");
const {DataTypes, Model} = require("sequelize");

class Task extends Model {
	static associate() {

	}
}

Task.init({
	task_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	event_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'event',
			key: 'event_id'
		}
	},
	task_name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	}
}, {
	sequelize,
	modelName: "task",
	tableName: "task",
});

module.exports = Task;


