var model = require('./model.js');

exports.update = function (req, res) {
	console.log('--start user update');
	//console.log('res', res);

	var connection = model.connection;

	var name = req.body.name;
	var rating = req.body.rating;

	var updateUserQuery = 'UPDATE `user` SET rating = ? WHERE name = ?';

	connection.query(updateUserQuery, [rating, name], function (err, response, fields) {
		if (err) {
			console.log('updateUserErr');
			res.render('menu/menu', { res: 'updateUserErr' });
		}

		res.render('menu/menu', { res: 'Successfully updated.' });
	});
};

