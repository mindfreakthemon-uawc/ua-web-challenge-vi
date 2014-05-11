require({
		baseUrl: '/js'
	}, [
		'gaussian-test',
		'test/median-test',
		'test/noise-test'
	],
	function () {
		QUnit.start();
	});
