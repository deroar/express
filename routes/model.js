var mysql = require('mysql');

exports.connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mysqlAdmin1=',
	database: 'matching'
});

