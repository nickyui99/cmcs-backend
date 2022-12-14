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
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		ngo_admin: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		contact_num: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		address: {
			type: DataTypes.TEXT("long"),
			allowNull: false,
		},
		bank_acc: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		tng_acc: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		acc_status: {
			type: DataTypes.STRING(10),
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