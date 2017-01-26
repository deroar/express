var K = 32;

function calcTotalRate(team, cb) {
	var teamTotalRate = 0;

	for (var key in team) {
		teamTotalRate += team[key].rating;
	}

	console.log('totalRate ', teamTotalRate);
	console.log('avrageRate ', teamTotalRate / 5);
	cb(null, teamTotalRate);
}

function calcNewRate (team, PTAElo, ETAElo, S, cb) {

	for (var key in team) { 
		var pElo = parseInt(team[key].rating);
		pProb = 1 / (1 + Math.pow(10, ( ETAElo - pElo) / 400) );
		tProb = 1 / (1 + Math.pow(10, ( ETAElo - PTAElo) / 400) );
		fProb = (pProb + tProb) / 2;

//		console.log('fProb ', fProb);
		team[key].rating = pElo + ( K * (S - fProb) );
//		console.log('newPElo', team[key].rating);
	}

	cb(null, team);
}

exports.getNewRate = function (teamA, teamB, cb) {
	console.log('--start calcRate--');

	var beforeTeamA = Object.assign(teamA);
	var beforeTeamB = Object.assign(teamB);

	var totalA = 0;
	var totalB = 0;	

	var S = 1;

	calcTotalRate(teamA, function (errTotalA, resTotalA) {
		if (errTotalA) {
			cb(errTotalA);
		}

		totalA = resTotalA;

		calcTotalRate(teamB, function (errTotalB, resTotalB) {
			if (errTotalB) {
				cb(resTotalB);
			}

			totalB = resTotalB;

			calcNewRate(teamA, (totalA / 5), (totalB / 5), S,function (errCalcNewRateA, resCalcNewRateA) {
				if (errCalcNewRateA) {
					cb(errCalcNewRateA);
				}

				teamA = resCalcNewRateA;

				calcNewRate(teamB, (totalB / 5), (totalA / 5), (1 - S), function (errCalcNewRateB, resCalcNewRateB) {
					if (errCalcNewRateB) {
						cb(errCalcNewRateB);
					}

					teamB = resCalcNewRateB;

					var res = {};
					res.teamA = teamA;
					res.teamB = teamB;

					console.log('getNewRate res', res);
					cb(null, res);
				});
			});
		});


	});
}
