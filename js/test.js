require({
		baseUrl: '/js'
	}, [
		'test/gaussian-test',
		'test/median-test',
		'test/noise-test'
	],
	function () {
		QUnit.start();
	});
