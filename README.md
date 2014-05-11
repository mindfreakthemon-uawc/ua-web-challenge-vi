ua-web-challenge-vi
===================

## How to start the application

* install grunt-cli with `npm install -g grunt-cli`
* `git clone` this repository
* cd into ua-web-challenge-vi filter
* run `npm install` to install app's dependencies
* run `grunt` to build the app and start local web server
* open http://localhost:9000/ for app's main window
* open http://localhost:9000/tests.html for qunit tests

## How to add new filter

You must define AMD module which returns filter descriptor.

```javascript

define(function () {
	return {
		label: '<filter-label>',
		name: '<filter-name>',
		runner: function noise(imageData, options) {
			// function receives imageData from the canvas
			// element and must perform process over it
		},
		options: {
			optionName: {
				label: '<option-label>',
				min: 0,
				max: 1,
				value: 0.5, // initial value
				step: 0.01,  // for type=range
				checked: true, // for type=checkbox
				type: 'range' // or 'checkbox'
			},
			// ...
		}
	};
});
```

Then you simply place created file in src/js/filters/ and include it as a dependency in src/js/filters.js.
All the rest will happen automagically.
