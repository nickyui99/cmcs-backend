const {Sequelize} = require("sequelize");

const CLIENT_ID = "767625170663-0v54gghevmafdjht00t73krviu7bb4a6.apps.googleusercontent.com";

// const sequelize = new Sequelize("cmcs", "root", "", {
// 	host: "127.0.0.1",
// 	dialect: "mysql",
// 	define: {
// 		timestamps: true,
// 	},
// 	pool: {
// 		max: 5,
// 		min: 0,
// 		acquire: 30000,
// 		idle: 10000
// 	}
// });

const sequelize = new Sequelize("defaultdb", "doadmin", "AVNS_nZ2a5tUoNyTRmiBYuAl", {
	host: "dbaas-db-5634255-do-user-13652355-0.b.db.ondigitalocean.com",
	dialect: "mysql",
	port: 25060,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

// const sequelize = new Sequelize("heroku_355354200d8eddf", "b51b59d934b13d", "8429f01d", {
// 	host: "us-cdbr-east-06.cleardb.net",
// 	dialect: "mysql",
// 	pool: {
// 		max: 5,
// 		min: 0,
// 		acquire: 30000,
// 		idle: 10000
// 	}
// });


module.exports = {sequelize, CLIENT_ID};