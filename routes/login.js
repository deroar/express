var express = require('express');
var model = require('./model.js');

/* GET home page. */
exports.index = function (req, res, next) {
	res.render('login', { title: 'matching' });
};

exports.login = function (req, res) {
	console.log('--start login--');

	var connection = model.connection;

	var name = req.query.name;
	console.log('login name: ', name);	

	var user = {
		name: name,
		rating: 1500
	};

	var selectUserQuery = 'SELECT * FROM `user` WHERE `name` = ?';
//	var insertUserQuery = 'INSERT INTO `user`(name, rating) values(? , 1500)';
	var insertUserQuery = 'INSERT INTO `user`(name, rating) values(? , 1500) ON DUPLICATE KEY UPDATE name = ?';
	var selectRoomQuery = 'SELECT * FROM `room`';
	var selectUserAllQuery = 'SELECT * FROM `user`';

	connection.query(selectUserQuery, [name], function (selErr, selRes, selFields) {
		if (selErr) {
			console.log('selectUserErr');
			//res.redirect('/');
		}

		console.log('login: ', selRes);

		if (!selRes) {
			connection.query(insertUserQuery, [name, name], function (insErr, insRes, insFields) {
				if (insErr) {
					console.log('inserUserErr');
					res.redirect('/');
				}

				connection.query(selectUserAllQuery, [], function (selUserErr, selUserRes, selUserFie) {
					if (selUserErr) {
						console.log('selectUserErr');
						res.redirect('/');
					}

					res.render('menu/menu', { res: selUserRes });
				});

			});
		} else {
			console.log('login: ' + selRes);

			connection.query(selectUserAllQuery, [], function (selUserErr, selUserRes, selUserFie) {
				if (selUserErr) {
					console.log('selectUserErr');
					res.redirect('/');
				}

				res.render('menu/menu', { res: selUserRes });
			});
		}
	});
};

