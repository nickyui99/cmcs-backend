const sequelize = require("../config");
const {DataTypes, Model} = require("sequelize");

class Event extends Model {
	static associate(models) {
		Event.belongsTo(models.Ngo, {
			foreignKey: 'ngo_id',
			targetKey: 'ngo_id'
		})
	}
}

Event.init({
		event_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		ngo_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'ngo',
				key: 'ngo_id'
			}
		},
		event_unique_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		start_datetime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_datetime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lng: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		lat: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		max_participant: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		trash_collected: {
			type: DataTypes.FLOAT,
		}
	},
	{
		sequelize,
		modelName: 'event',
		tableName: 'event',
	}
);


module.exports = Event;