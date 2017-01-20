var model = require('./model.js');

exports.getUsers = function (req, res) {
	console.log('--start getUsers--');

	var connection = model.connection;
	var selectUsersQuery = 'SELECT * FROM `user`';

	connection.query(selectUsersQuery, [], function (err, response, fields) {
		if (err) {
			console.log('getUsersErr');
			res.redirect('menu/menu');
		}

		res.redirect('menu/menu', { res: response });
	});
};
