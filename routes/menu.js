var model = require('./model.js');

exports.index = function (req, res) {
	console.log('--start menu/index--');

	var connection = model.connection;
	var selectUsersQuery = 'SELECT * FROM `user`';

	connection.query(selectUsersQuery, [], function (err, response, fields) {
		if (err) {
			console.log('menuIndexErr');
			res.redirect('menu/menu');
		}

		res.render('menu/menu', { res: response });
	});
};
