define(['Vue', 'text!components/askForEmail/askForEmail.html', 'utils'], function(Vue, askForEmailHTML, utils) {
	return {
		replace: false,
		template: askForEmailHTML,
		data: function() {
			return {
				email: undefined,
				validationMsg: undefined
			}
		},
		ready: handleReady,
		methods: {
			handleNotNowClicked: handleNotNowClicked,
			handleOkClicked: handleOkClicked,
			handleCloseClicked: handleCloseClicked
		}
	};

	function handleReady() {
		var $dialog = jQuery(this.$el).find('[role="dialog"]');
		$dialog.modal();
	}

	function handleCloseClicked() {
		var $dialog = jQuery(this.$el).find('[role="dialog"]');
		$dialog.modal('hide');
		$dialog.on('hidden.bs.modal', function() {
			vueScope.$dispatch('email-edit-closed');
		});
	}

	function handleNotNowClicked(event) {
		var vueScope = this;
		var $dialog = jQuery(this.$el).find('[role="dialog"]');
		$dialog.modal('hide');
		$dialog.on('hidden.bs.modal', function() {
			vueScope.$dispatch('email-edit-canceled');
		});
	}

	function handleOkClicked() {
		var vueScope = this;
		vueScope.$data.validationMsg = undefined;
		showLoading();

		jQuery.ajax({
			url: '/ws/integrated/v1/store/employees/',
			data: JSON.stringify({
				email: vueScope.$data.email
			}),
			method: 'PUT',
			contentType: 'application/json'
		}).then(function() {
			var $dialog = jQuery(this.$el).find('[role="dialog"]');
			$dialog.modal('hide');
			vueScope.$dispatch('email-edited', {
				email: vueScope.$data.email
			});
			hideLoading();
		}).fail(function(err) {
			if (err.status === 409) {
				vueScope.$data.validationMsg = err.responseJSON.errors;
			} else {
				utils.handleError(err);
			}
			hideLoading();
		});

		return true;
	}

});
