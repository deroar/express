var model = require('./model.js');

exports.update = function (req, res) {
	console.log('--start user update');
	console.log('req', req.body);

	var connection = model.connection;

	var name = req.body.name;
	var rating = req.body.rating;

	var updateUserQuery = 'INSERT INTO `user`(name, rating) values(? , ?) ' +
		'ON DUPLICATE KEY UPDATE name = ?';
	var selectUserAllQuery = 'SELECT * FROM `user`';

	connection.query(updateUserQuery, [name, rating, name], function (err, response, fields) {
		if (err) {
			console.log('updateUserErr');
			res.render('menu/menu', { res: 'updateUserErr' });
		}

		connection.query(selectUserAllQuery, [], function (selUserErr, selUserRes, selUserFie) {
			if (selUserErr) {
				console.log('selectUserErr');
				res.redirect('/');
			}

			res.render('menu/menu', { res: selUserRes });
		});
	});
};

