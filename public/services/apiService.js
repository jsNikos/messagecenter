define(['q'], function(q) {
	return new ApiService();

	function ApiService() {

		this.findDWMessagesEditorInit = function() {
			return q.Promise(function(resolve, reject) {
				jQuery.ajax({
					url: '/ws/messagingcenter/findDWMessagesEditorInit',
					method: 'GET',
					success: resolve,
					error: reject
				});
			})
		}

		this.fetchEmployees = function() {
			return q.Promise(function(resolve, reject) {
				jQuery.ajax({
					url: '/ws/integrated/v1/store/employees/',
					method: 'GET',
					success: resolve,
					error: reject
				});
			});
		};

		function appendRecipientsToForm(recipients) {
			$('<input>').attr({
				type: 'hidden',
				name: 'recipients',
				value: JSON.stringify(recipients)
			}).appendTo('form');
			return true;
		}

		this.submitForm = function(recipients) {
			appendRecipientsToForm(recipients);
			jQuery('form[name="MessageEditor"]').submit();
		};
	}
})
