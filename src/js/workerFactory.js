define(function () {
	return function () {
		var worker = new Worker('/js/thread.js');

		worker.postMessage('');

		return worker;
	};
});
