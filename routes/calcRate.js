function calcTotalRate(team, cb) {
	var teamTotalRate = 0;

	for (var key in team) {
		teamTotalRate += team[key].rating;
	}

	cb(null, teamTotalRate);
}

function calcNewRate (team, PTAElo, ETAElo, K, S, cb) {

	for (var key in team) { 
		var pElo = parseInt(team[key].rating);
		pProb = 1 / (1 + Math.pow(10, ( ETAElo - pElo) / 400) );
		tProb = 1 / (1 + Math.pow(10, ( ETAElo - PTAElo) / 400) );
		fProb = (pProb + tProb) / 2;

		team[key].rating = pElo + ( K * (S - fProb) );
	}

	cb(null, team);
}

exports.getNewRate = function (teamA, teamB, K, cb) {
	console.log('--start calcRate--');
	console.log('teamA, teamB, K', teamA, teamB, K);

	var totalA = 0;
	var totalB = 0;	

	var S = 1;

	teamA.forEach(function (player) {
		totalA += player.rating;
	});

	teamB.forEach(function (player) {
		total += player.rating;
	});

	console.log('team A (total, average)', total, (totalA / teamA.length));
	console.log('team B (total, average)', total, (totalB / teamB.length));

	calcNewRate(teamA, (totalA / teamA.length), (totalB / teamB.length), K, S, function (errCalcNewRateA, resCalcNewRateA) {
		if (errCalcNewRateA) {
			cb(errCalcNewRateA);
		}

		teamA = resCalcNewRateA;
			calcNewRate(teamB, (totalB / teamB.length), (totalA / teamA.length), K, (1 - S), function (errCalcNewRateB, resCalcNewRateB) {
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
};
