define(['Vue', 'EmployeesTable', 'RecipientList', 'MessageCenterService'],
	function(Vue, EmployeesTable, RecipientList, MessageCenterService) {
		return new MessageCenterApp();

		function MessageCenterApp() {
			Vue.config.debug = true;
			var messageCenterService = new MessageCenterService();

			new Vue({
				el: '#messageCenterApp',
				data: {
					showLoading: false,
					emailDelivery: undefined,
					employeeHasEmail: window.employeeHasEmail,
					submitAction: undefined,
					recipients: [] // [Employee]
				},
				ready: messageCenterService.handleReady,
				components: {
					'employees-table': EmployeesTable,
					'recipient-list': RecipientList
				},
				methods: {
					handleSendClicked: messageCenterService.handleSendClicked,
					handleSaveClicked: messageCenterService.handleSaveClicked,
					handleDeleteClicked: messageCenterService.handleDeleteClicked,
					handleRemoveRecipient: messageCenterService.handleRemoveRecipient,
					handleRemoveAllRecipients: messageCenterService.handleRemoveAllRecipients
				}
			});
		}

	});
