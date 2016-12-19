define(['Vue', 'EmployeesTable', 'RecipientList', 'MessageCenterService', 'apiService'],
	function(Vue, EmployeesTable, RecipientList, MessageCenterService, apiService) {
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
				watch: {
					'employees': {
						handler: handleEmployeesChanged,
						deep: true
					}
				},
				ready: handleReady,
				components: {
					'employees-table': EmployeesTable.component,
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

			function handleReady() {
				var vueScope = this;
				messageCenterService.handleReady();
				apiService.fetchEmployees().then(function(employees) {
						_.forEach(employees, function(employee) {
							enrichEmployee(employee);
							vueScope.$data.employees.push(employee);
						});
						_.forEach(vueScope.$data.recipients, applyRecipientSelection.bind(vueScope, employees));
					})
					.catch(handleError);
			}

			function applyRecipientSelection(employees, recipient) {
				var employee = _.find(employees, {
					name: recipient.employeeId
				});
				employee && (employee._selected = true);
			}

			function handleEmployeesChanged() {
				this.$broadcast(EmployeesTable.topics.EMPLOYEES_CHANGED);
			}

			function enrichEmployee(employee) {
				employee._selected = false;
			}
		}

	});
