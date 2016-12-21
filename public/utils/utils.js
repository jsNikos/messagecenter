define(['q', 'Vue'], function(q, Vue) {
	return new Utils();

	function Utils() {
		this.nextTick = function() {
			return q.Promise(function(resolve) {
				Vue.nextTick(resolve);
			});
		};

		this.timeout = function() {
			return q.Promise(function(resolve) {
				setTimeout(resolve, 0);
			});
		};

		this.handleError = function(err) {
			err && window.console && console.log(err);
		};
	}

});
