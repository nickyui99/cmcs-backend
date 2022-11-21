const sequelize = require("../config");
const {DataTypes, Model} = require("sequelize");
const Account = require("./Account");

class Ngo extends Model {
	static associate() {

	}
}

Ngo.init({
		ngo_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		acc_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'account',
				key: 'acc_id'
			}
		},
		ngo_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ngo_admin: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contact_num: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		bank_acc: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tng_acc: {
			type: DataTypes.STRING,
			allowNull: false
		},
		hrs_of_service: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		trash_collected: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		acc_status: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		sequelize,
		modelName: "ngo",
		tableName: "ngo",
	}
);

module.exports = Ngo;