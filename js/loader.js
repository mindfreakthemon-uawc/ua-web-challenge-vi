define(function () {
	var loader = document.getElementById('loader');

	return {
		hide: function () {
			// hide loader when necessary
			var i = +loader.dataset.waiting;

			if (i === 1) {
				loader.classList.add('hidden');
				loader.dataset.waiting = 0;
			} else {
				loader.dataset.waiting = i - 1;
			}
		},
		show: function () {
			// increment loader count
			loader.dataset.waiting = (loader.dataset.waiting | 0) + 1;
			loader.classList.remove('hidden');
		}
	}
});
