const {Sequelize} = require("sequelize");


// const con = mysql.createConnection({
// 	host: "sql6.freesqldatabase.com",
// 	user: "sql6518513",
// 	password: "EvM9hkJItd",
// 	database: "sql6518513"
// });

const sequelize = new Sequelize('cmcs', 'root', '', {
	host: "127.0.0.1",
	dialect: 'mysql',
	define: {
		timestamps: false,
	}
});

module.exports = sequelize;