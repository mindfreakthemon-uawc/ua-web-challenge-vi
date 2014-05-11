require({
		baseUrl: '/js'
	}, [
		'test/filters/gaussian-test',
		'test/filters/median-test',
		'test/filters/noise-test'
	],
	function () {
		QUnit.start();
	});
