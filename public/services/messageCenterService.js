define(['apiService', 'lodash', 'q'], function(apiService, _, q) {
	return MessageCenterService;

	function MessageCenterService() {

		this.handleReady = function() {
			var vueScope = this;

			window.showLoading = function() {
				vueScope.$data.showLoading = true;
			}

			window.hideLoading = function() {
				vueScope.$data.showLoading = false;
			}
		};

		this.handleRemoveAllRecipients = function() {
			_.forEach(this.$data.recipients, function(recipient) {
				recipient._selected = false;
			});
			this.$data.recipients.splice(0, this.$data.recipients.length);
		};

		this.handleSaveClicked = function() {
			this.$data.submitAction = 'Save';
			if (!this.$data.employeeHasEmail && this.$data.emailDelivery) {
				askForEmail().then(submitForm.bind(this));
			} else {
				submitForm.call(this);
			}
		};

		this.handleDeleteClicked = function() {
			this.$data.submitAction = 'Delete';
			confirmDelete()
				.then(submitForm.bind(this))
				.catch(handleError);
		};

		this.handleSendClicked = function() {
			this.$data.submitAction = 'Send';
			if (!this.$data.employeeHasEmail && this.$data.emailDelivery) {
				askForEmail()
					.then(submitForm.bind(this))
					.catch(handleError);
			} else {
				submitForm.call(this);
			}
		};

		this.handleRemoveRecipient = function(recipient) {
			var idx = _.findIndex(this.$data.recipients, {
				name: recipient.name
			});
			if (idx > -1) {
				this.$data.recipients.splice(idx, 1);
			}
			recipient._selected = false;
		};

		function submitForm() {
			this.$nextTick(function() {
				apiService.submitForm(this.$data.recipients);
			});
		}

		function askForEmail() {
			return q.Promise(function(resolve, reject) {
				require(['AskForEmail'], function(AskForEmail) {
					var el = jQuery('<div><ask-for-email></ask-for-email></div>').appendTo('body').get(0);
					var vue = new Vue({
						el: el,
						components: {
							'ask-for-email': AskForEmail
						},
						events: {
							'email-edit-canceled': resolveEvent,
							'email-edited': resolveEvent,
							'email-edit-closed': rejectEvent
						}
					});

					function resolveEvent(data) {
						resolve(data);
						removeDialog();
					}

					function rejectEvent() {
						reject();
						removeDialog();
					}

					function removeDialog() {
						vue.$destroy();
						jQuery(el).remove();
					}
				});
			});
		}

		function confirmDelete() {
			return q.Promise(function(resolve, reject) {
				require(['ConfirmDialog'], function(ConfirmDialog) {
					var el = jQuery('<div><confirm-delete confirmation-message="Do you really want to delete this message?"></confirm-delete></div>').appendTo('body').get(0);
					var vue = new Vue({
						el: el,
						components: {
							'confirm-delete': ConfirmDialog
						},
						events: {
							'ok': resolveEvent,
							'cancel': rejectEvent
						}
					});

					function resolveEvent(data) {
						resolve(data);
						removeDialog();
					}

					function rejectEvent() {
						reject();
						removeDialog();
					}

					function removeDialog() {
						vue.$destroy();
						jQuery(el).remove();
					}
				});
			});
		}
	}
});
