define(function () {
	var worker = new Worker('/js/thread.js');

	worker.postMessage('');

	return worker;
});
