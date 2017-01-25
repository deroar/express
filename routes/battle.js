var model = require('./model.js');

exports.update = function (req, res) {
        console.log('--start battleResult update--');
        console.log('req', req.body);

        var connection = model.connection;

        var name = req.body.name;
        var rating = req.body.rating;
	var opponentName = req.body.opponentName;
	var opponentRating = req.body.opponentRating;
	var winner = req.body.winner;

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
};

