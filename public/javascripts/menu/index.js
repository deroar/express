function displayUser (data) {
	console.log('Display User');

	for (var i = 0; i < data.length; i++) {
		console.log('data[i]', data[i]);
		var obj = $(document.createElement('div'));
		obj.html(data[i]);
		$('#user').append('<tr><td>' + data[i].name + '</td><td>' + data[i].rating + '</td></tr>');
	}
}

