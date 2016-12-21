define(['Vue', 'EmployeesTable', 'RecipientList', 'MessageCenterService', 'apiService', 'utils'],
	function(Vue, EmployeesTable, RecipientList, MessageCenterService, apiService, utils) {
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
					employees: [], // [Employee]
					recipients: [] // [Employee]
				},
				ready: handleReady,
				components: {
					'employees-table': EmployeesTable.component,
					'recipient-list': RecipientList
				},
				methods: {
					handleSendClicked: messageCenterService.handleSendClicked,
					handleSaveClicked: messageCenterService.handleSaveClicked,
					handleDeleteClicked: messageCenterService.handleDeleteClicked
				}
			});

			function handleReady() {
				var vueScope = this;
				messageCenterService.handleReady();
				apiService.fetchEmployees().then(function(employees) {
						_.forEach(employees, function(employee) {
							enrichEmployee(employee);
							vueScope.$data.employees.push(employee);
						});
						applyExistingRecipients.call(vueScope);
					})
					.catch(utils.handleError);
			}

			function applyExistingRecipients() {
				var vueScope = this;
				if (!window.existingRecipients) {
					return;
				}
				_.forEach(existingRecipients, function(existingRecipient) {
					var employee = _.find(vueScope.$data.employees, {
						name: existingRecipient.employeeId
					});
					if (employee) {
						employee._selected = true;
						vueScope.$data.recipients.push(employee);
					}
				});
			}

			function enrichEmployee(employee) {
				employee._selected = false;
			}
		}

	});
