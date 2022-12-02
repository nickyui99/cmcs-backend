const {Model, DataTypes} = require("sequelize");
const sequelize = require("../config");


class Alert extends Model{
	static associate(models){

	}
}

Alert.init({
	alert_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	usr_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'user',
			key: 'usr_id'
		}
	},
	title:{
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	description:{
		type: DataTypes.TEXT("long"),
		allowNull: false,
	},
	datetime: {
		type: DataTypes.DATE,
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
	address: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	image: {
		type: DataTypes.TEXT('long'),
		allowNull: false,
	},
},
	{
		sequelize,
		modelName: 'alert',
		tableName: 'alert',
	}
);

module.exports = Alert;