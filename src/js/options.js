define(['filters', 'templates'],
	function (filters, templates) {
		var form = document.getElementById('form'),
			apply = document.getElementById('apply'),
			options = document.getElementById('filter-options'),
			cancel = document.getElementById('cancel');

		function updateFilterOptions(filterName) {
			var filter = filters[filterName];

			options.innerHTML = templates['options'](filter);

			if (filterName) {
				apply.classList.remove('disabled');
				apply.disabled = false;
				cancel.classList.remove('disabled');
				cancel.disabled = false;
			} else {
				apply.classList.add('disabled');
				apply.disabled = true;
				cancel.classList.add('disabled');
				cancel.disabled = true;

				if (form.elements.filterName instanceof NodeList) {
					// if there is more than one filter,
					// uncheck them all
					Array.prototype.forEach.call(form.elements.filterName,
						function (input) {
							input.checked = false;
						});
				} else {
					form.elements.filterName.checked = false;
				}
			}
		}

		return {
			update: updateFilterOptions
		}
	});
