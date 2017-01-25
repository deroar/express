var model = require('./model.js');

const K = 32; 
const win = 1;
const lose = 0;
const draw = 0.5;

function getRateByName (name, cb) {
	var connection = model.connection;
	var selectUserQuery = 'SELECT rating FROM `user` WHERE `name` = ?';

	connection.query(selectUserQuery, [name], function (selErr, selRes, selFields) {
		if (selErr) {
			return cb(selErr);
		}

		console.log('selRes', selRes);
		return cb(null, selRes);
	});
}

function getWinProbablity (name, opponentName, cb) {
	var result = {};

	getRateByName(name, function (err, res) {
		if (err) {
			return cb(err);
		}

		var rate = result.rate = res[0].rating;
		console.log('rate: ', rate);

		getRateByName(opponentName, function (error, response) {
			if (error) {
				return cb(error);
			}

			var opponentRate = result.opponentRate  = response[0].rating;
			console.log('opponentRate: ', opponentRate);

			var probablity = result.probablity =1 / (1 + Math.pow(10, (opponentRate - rate) / 400) );
			console.log('propbablity: ', probablity);

			return cb(null, result);
		})
	}); 
}

exports.getNewRate = function (req, res) {
	console.log('--start getNewRate--');
	var name = req.body.name;
	var opponentName = req.body.opponentName;
	var winner = req.body.winner;

	getWinProbablity(name, opponentName, function (error, response) {
		if (error) {
			console.log(error);
		}

		var S1 = 0;
		if (winner == name) {
			S1 = 1;
		}

		var probablity1 = response.probablity;
		var newRate1 = response.rate + K * ( S1 - probablity1);
		console.log('newRate1', newRate1);

		getWinProbablity(opponentName, name, function (err, response) {
			if (err) {
				console.log(err);
			}

			var S2 = 1 - S1;

			var probablity2 = response.probablity;
			var newRate2 = response.rate + K * ( S2 - probablity2);
			console.log('newRate2', newRate2);

			var connection = model.connection;
			var updateQuery = 'UPDATE `user` SET rating = ? WHERE name = ?';

			connection.query(updateQuery, [newRate1, name], function (updateErr1, updateRes1, updateFiel1) {
				if (updateErr1) {
					console.log('updateErr1');
				}

				connection.query(updateQuery, [newRate2, opponentName] , function (updateErr2, updateRes2, updateFiel2) {
					if (updateErr2) {
						console.log('updateErr2');
					}

					var selectUserAllQuery = 'SELECT * FROM `user`';

					connection.query(selectUserAllQuery, [], function (selUserErr, selUserRes, selUserFie) {
						if (selUserErr) {
							console.log('selectUserErr');
							res.redirect('/');
						}

						res.render('menu/menu', { res: selUserRes });
					});
				});
			});

		});
	});
};
