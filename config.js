const {Sequelize} = require("sequelize");


// const sequelize = new Sequelize("cmcs", "root", "", {
// 	host: "127.0.0.1",
// 	dialect: "mysql",
// 	define: {
// 		timestamps: false,
// 	}
// });

const sequelize = new Sequelize("sql6582248", "sql6582248", "l6qg7ePrQU", {
	host: "sql6.freesqldatabase.com",
	dialect: "mysql",
	define: {
		timestamps: false,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
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