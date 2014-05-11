require({
		baseUrl: 'js'
	}, [
		'tests/filters/gaussian-test',
		'tests/filters/median-test',
		'tests/filters/noise-test'
	],
	function () {
		QUnit.start();
	});
