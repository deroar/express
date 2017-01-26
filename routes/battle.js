var model = require('./model.js');
var calcRate = require('./calcRate.js');

var K = 32;

function orgUsers (users, cb) {
	console.log('--start orgUsers--');

	var keys = Object.keys(users);

	var teamA = {
		A1: {},
		A2: {},
		A3: {},
		A4: {},
		A5: {}
	};

	var teamB = {
		B1: {},
		B2: {},
		B3: {},
		B4: {},
		B5: {}
	};

	keys.forEach(function (key) {
		var str = key.split('-');

		if (str[0] == 'teamA') {
			if (str[2] == 'rating') {
				teamA[str[1]][str[2]] = parseInt(users[key]);
			} else {
				teamA[str[1]][str[2]] = users[key];
			}
		}

		if (str[0] == 'teamB') {
			if (str[2] == 'rating') {
				teamB[str[1]][str[2]] = parseInt(users[key]);
			} else {
				teamB[str[1]][str[2]] = users[key];
			}
		}
	});

	var res = {};

	var teamArrayA = [];
	var teamArrayB = [];

	for (var key in teamA) {
		teamArrayA.push(teamA[key]);
	}

	for (var key in teamB) {
		teamArrayB.push(teamB[key]);
	}

	res.teamA = teamArrayA;
	res.teamB = teamArrayB;

	console.log('res', res);
	cb(null, res);
}


exports.result = function (req, res) {
        console.log('--start battleResult update--');

	orgUsers(req.body, function (error, response) {
		if (error) {
			console.log('orgUsersErr');
		}

		var teamA = Object.assign(response.teamA);
		var teamB = Object.assign(response.teamB);

		calcRate.getNewRate(teamA, teamB, K, function (errCalcRate, resCalcRate) {
			if (errCalcRate) {
				console.log('errCalcRate', errCalcRate);
			}

			var resTeamA = resCalcRate.teamA;
			var resTeamB = resCalcRate.teamB;

			res.send({ result: { teamA: resTeamA, teamB: resTeamB } });

		});
	});

/*
        var insertBattleQuery = 'INSERT INTO `battleResult`(name, rating, opponentName, opponentRating, winner) values(? , ?, ?, ?, ?)';
        var selectUserAllQuery = 'SELECT * FROM `user`';

        connection.query(insertBattleQuery, [name, rating, opponentName, opponentRating, winner], function (err, response, fields) {
                if (err) {
                        console.log('insertBattleErr');
                        res.render('menu/menu', { res: 'insertBattleErr' });
                }

                connection.query(selectUserAllQuery, [], function (selUserErr, selUserRes, selUserFie) {
                        if (selUserErr) {
                                console.log('selectUserErr');
                                res.redirect('/');
                        }

                        res.render('menu/menu', { res: selUserRes });
                });
        });
*/
};

