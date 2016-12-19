define(['Vue', 'EmployeesTable', 'RecipientList', 'MessageCenterService', 'apiService', 'MultiSelect'],
	function(Vue, EmployeesTable, RecipientList, MessageCenterService, apiService, MultiSelect) {
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

					storeSets: undefined, // [string]
					selectedStoreSet: undefined, // string

					roles: undefined, // [{name: string}]
					stores: undefined, // [string]
					selectedStore: undefined, // string
					storeEmployees: undefined // {storeName -> [Employee]}
				},
				ready: handleReady,
				components: {
					'employees-table': EmployeesTable,
					'recipient-list': RecipientList,
					'multiselect': MultiSelect.component
				},
				methods: {
					handleSendClicked: messageCenterService.handleSendClicked,
					handleSaveClicked: messageCenterService.handleSaveClicked,
					handleDeleteClicked: messageCenterService.handleDeleteClicked,
					handleRemoveRecipient: messageCenterService.handleRemoveRecipient,
					handleRemoveAllRecipients: messageCenterService.handleRemoveAllRecipients,
					handleAllEnterpriseSelected: handleAllEnterpriseSelected,
					handleAllEnterpriseDeselected: handleAllEnterpriseDeselected,
					handleEnterpriseRoleChanged: handleEnterpriseRoleChanged,
					handleStoreChanged: handleStoreChanged
				}
			});

			function handleStoreChanged(){
				//TODO
			}

			function handleAllEnterpriseSelected(){
				//TODO
			}

			function handleAllEnterpriseDeselected(){
				//TODO
			}

			function handleEnterpriseRoleChanged(role, checked){
				//TODO
			}

			function handleReady() {
				var vueScope = this;
				messageCenterService.handleReady();
				jQuery(this.$el).find('#tabs').tabs();
				apiService.findDWMessagesEditorInit().then(function(resp) {
						vueScope.$data.storeSets = resp.storeSets;
						vueScope.$data.roles = _.map(resp.roles, createRole);
						vueScope.$data.stores = resp.stores;
						vueScope.$broadcast(MultiSelect.topics.REBUILD);
					})
					.catch(handleError);
			}

			function createRole(roleName) {
				return {
					name: roleName,
					_selected: false
				};
			}

		}

	});
