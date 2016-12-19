define(['Vue', 'text!components/confirmDialog/confirmDialog.html'],
function(Vue, confirmDialogHTML) {
	return {
		replace: false,
		template: confirmDialogHTML,
		props: ['confirmationMessage', 'detailMessage'],
		ready: handleReady,
		methods: {
			handleCloseClicked: handleCancelClicked,
			handleCancelClicked: handleCancelClicked,
			handleOkClicked: handleOkClicked
		}
	};

	function handleReady() {
		$dialog = jQuery(this.$el).find('[role="dialog"]');
		$dialog.modal();
	}

	function handleCancelClicked() {
		var vueScope = this;
		$dialog.modal('hide');
		$dialog.on('hidden.bs.modal', function() {
			vueScope.$dispatch('cancel');
		});
	}

	function handleOkClicked() {
		var vueScope = this;
		$dialog.modal('hide');
		$dialog.on('hidden.bs.modal', function() {
			vueScope.$dispatch('ok');
		});
	}
}
});
