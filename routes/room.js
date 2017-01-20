var model = require('./model.js');

exports.update = function (req, res) {
        console.log('--start room add--');

	var connection = model.connection;
	var id = req.body.roomId;
	var name = req.body.roomName;
	var hostName = req.body.hostName;
	var rating = req.body.rating;

	var updateRoomQuery = 'INSERT INTO `room` (id, name, hostName, rating) VALUES (?, ?, ?, ?) ' +
		'ON DUPLICATE KEY UPDATE id = ?';

	connection.query(updateRoomQuery, [id, name, hostName, rating, id], function (err, response, fields) {
		if (err) {
			console.log('updateRoomErr');
			res.redirect('/');
		}

		res.render('menu/menu');
	});
};

