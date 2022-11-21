const {Sequelize} = require("sequelize");


// const con = mysql.createConnection({
// 	host: "sql6.freesqldatabase.com",
// 	user: "sql6518513",
// 	password: "EvM9hkJItd",
// 	database: "sql6518513"
// });

const sequelize = new Sequelize("mysql://bbfca9b2e17dab:ec6c2e66@us-cdbr-east-06.cleardb.net/heroku_6a1fde77ac93ba1?reconnect=true", {
	define: {
		timestamps: false,
	}
});

module.exports = sequelize;