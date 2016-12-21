define(['Vue', 'EmployeesTable', 'DwRecipientList', 'MessageCenterService', 'apiService', 'MultiSelect', 'utils', 'q'],
	function(Vue, EmployeesTable, DwRecipientList, MessageCenterService, apiService, MultiSelect, utils, q) {
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

					recipients: [], // [Employee],
					enterpriseRecipients: [], // [{storeSet: string, role: Role}]

					storeSets: undefined, // [string]
					selectedStoreSet: undefined, // string
					storeSetRoles: {}, // {storeSet -> [Role]}
					enterpriseRoles: [], // [Role]

					stores: undefined, // [string]
					selectedStore: undefined, // string
					storeEmployeeMap: {}, // {store -> [Employee]}
					storeEmployees: {} // [Employee]
				},
				ready: handleReady,
				components: {
					'employees-table': EmployeesTable.component,
					'dw-recipient-list': DwRecipientList,
					'multiselect': MultiSelect.component
				},
				methods: {
					handleSendClicked: messageCenterService.handleSendClicked,
					handleSaveClicked: messageCenterService.handleSaveClicked,
					handleDeleteClicked: messageCenterService.handleDeleteClicked,

					handleStoreSetChanged: handleStoreSetChanged,
					handleAllEnterpriseSelected: handleAllEnterpriseSelected,
					handleAllEnterpriseDeselected: handleAllEnterpriseDeselected,
					handleEnterpriseRoleChanged: handleEnterpriseRoleChanged,

					handleRemoveAll: handleRemoveAll,

					handleStoreChanged: handleStoreChanged
				}
			});

			function handleRemoveAll() {
				this.$broadcast(MultiSelect.topics.REFRESH_SELECTS);
			}

			function handleStoreSetChanged(storeSet) {
				this.$data.enterpriseRoles = this.$data.storeSetRoles[storeSet];
			}

			function handleStoreChanged() {
				var vueScope = this;
				var storeName = this.$data.selectedStore;
				var storeEmployeeMap = this.$data.storeEmployeeMap;

				q.Promise(function(resolve) {
						if (storeEmployeeMap[storeName]) {
							resolve(storeEmployeeMap[storeName]);
						} else {
							return apiService.fetchStoreEmployees(storeName)
								.then(function(resp) {
									_.forEach(resp.employees, enrichEmployee.bind(vueScope, storeName));
									storeEmployeeMap[storeName] = resp.employees;
									resolve(storeEmployeeMap[storeName]);
								});
						}
					})
					.then(function(employees) {
						vueScope.$data.storeEmployees = employees;
					})
					.catch(utils.handleError);
			}

			function handleAllEnterpriseDeselected() {
				var selectedStoreSet = this.$data.selectedStoreSet;
				var enterpriseRoles = this.$data.enterpriseRoles;

				_.forEach(enterpriseRoles, removeFromEnterpriseRecipients.bind(this, selectedStoreSet));
				deselectEnterpriseRoles(enterpriseRoles);
			}

			function handleEnterpriseRoleChanged(role, checked) {
				var selectedStoreSet = this.$data.selectedStoreSet;

				if (checked) {
					var enterpriseRecipient = createEnterpriseRecipient.call(this, selectedStoreSet, role);
					addToEnterpriseRecipients.call(this, enterpriseRecipient);
					role._selected = true;
				} else {
					removeFromEnterpriseRecipients.call(this, selectedStoreSet, role);
					role._selected = false;
				}
			}

			function handleAllEnterpriseSelected() {
				var selectedStoreSet = this.$data.selectedStoreSet;
				var enterpriseRoles = this.$data.enterpriseRoles;

				_.chain(enterpriseRoles)
					.map(createEnterpriseRecipient.bind(this, selectedStoreSet))
					.forEach(addToEnterpriseRecipients.bind(this))
					.value();
				selectEnterpriseRoles(enterpriseRoles);
			}

			function deselectEnterpriseRoles(enterpriseRoles) {
				_.forEach(enterpriseRoles, function(enterpriseRole) {
					enterpriseRole._selected = false;
				});
			}

			function selectEnterpriseRoles(enterpriseRoles) {
				_.forEach(enterpriseRoles, function(enterpriseRole) {
					enterpriseRole._selected = true;
				});
			}

			function removeFromEnterpriseRecipients(storeSet, enterpriseRole) {
				var enterpriseRecipients = this.$data.enterpriseRecipients;
				var idx = _.findIndex(enterpriseRecipients, function(target) {
					return target.storeSet === enterpriseRole._storeSet &&
						target.role.name === enterpriseRole.name;
				});
				if (idx > -1) {
					enterpriseRecipients.splice(idx, 1);
				}
			}

			function addToEnterpriseRecipients(enterpriseRecipient) {
				var enterpriseRecipients = this.$data.enterpriseRecipients;
				var recipientExists = _.find(enterpriseRecipients, function(target) {
					return target.storeSet === enterpriseRecipient.storeSet &&
						target.role.name === enterpriseRecipient.role.name;
				});

				if (!recipientExists) {
					enterpriseRecipients.push(enterpriseRecipient);
				}
			}

			function createEnterpriseRecipient(storeSet, role) {
				return {
					storeSet: storeSet,
					role: role
				};
			}

			function handleReady() {
				var vueScope = this;
				messageCenterService.handleReady();
				jQuery(this.$el).find('#tabs').tabs();
				apiService.findDWMessagesEditorInit().then(function(resp) {
						vueScope.$data.storeSets = resp.storeSets;
						vueScope.$data.storeSetRoles = computeStoreSetRoles(vueScope.$data.storeSets, resp.roleNames);
						vueScope.$data.stores = resp.stores;
					})
					.catch(utils.handleError);
			}

			function computeStoreSetRoles(storeSets, roleNames) {
				var storeSetRoles = {};
				_.forEach(storeSets, function(storeSet) {
					storeSetRoles[storeSet] = _.map(roleNames, createRole.bind(this, storeSet));
				});
				return storeSetRoles;
			}

			function enrichEmployee(storeName, employee) {
				employee._selected = false;
				employee._storeName = storeName;
			}

			function createRole(storeSet, roleName) {
				return {
					name: roleName,
					_storeSet: storeSet,
					_selected: false
				};
			}

		}

	});
