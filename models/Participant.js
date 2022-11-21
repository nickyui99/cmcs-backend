const sequelize = require("../config");
const {DataTypes, Model} = require("sequelize");

class Participant extends Model {
	static associate() {

	}
}

Participant.init({
	participant_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	event_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'event',
			key: 'event_id'
		}
	},
	usr_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'user',
			key: 'usr_id'
		}
	},
	attendance: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	status: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	}
}, {
	sequelize,
	modelName: "participant",
	tableName: "participant",
});

module.exports = Participant;