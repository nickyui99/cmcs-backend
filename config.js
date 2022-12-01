const {Sequelize} = require("sequelize");


// const con = mysql.createConnection({
// 	host: "sql6.freesqldatabase.com",
// 	user: "sql6518513",
// 	password: "EvM9hkJItd",
// 	database: "sql6518513"
// });

const sequelize = new Sequelize("cmcs", "root", "", {
	host: "127.0.0.1",
	dialect: "mysql",
	define: {
		timestamps: false,
	}
});


// const sequelize = new Sequelize("cmcs", "nick@cmcs1", "Nicholas12345!", {
// 	host: "cmcs1.database.windows.net",
// 	dialect: "mssql",
// 	define: {
// 		timestamps: false,
// 	},
// 	parseJSON: true,
// 	dialectOptions: {
// 		encrypt: true,
// 		enableArithAbort: true,
// 		trustServerCertificate: false
// 	},
// 	pool: {
// 		min: 0,
// 		idleTimeoutMillis: 3000
// 	}
// });

// const sequelize = new Sequelize("cmcs", "nick@cmcs1", "Nicholas12345!", {
// 	host: "cmcs-9766a:us-central1:cmcs",
// 	dialect: "mssql",
// 	define: {
// 		timestamps: false,
// 	},
// 	parseJSON: true,
// 	dialectOptions: {
// 		encrypt: true,
// 		enableArithAbort: true,
// 		trustServerCertificate: false
// 	},
// 	pool: {
// 		min: 0,
// 		idleTimeoutMillis: 3000
// 	}
// });

module.exports = sequelize;
