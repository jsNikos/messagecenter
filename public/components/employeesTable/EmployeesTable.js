define(['text!components/employeesTable/employeesTable.html', 'lodash', 'q', 'Vue', 'MultiSelect'],
	function(employeesTableHTML, _, q, Vue, MultiSelect) {
		return Vue.extend({
			replace: false,
			template: employeesTableHTML,
			props: ['recipients'],
			data: function() {
				return {
					employees: undefined
				}
			},
			computed: {
				roles: computeRoles
			},
			components: {
				multiselect: MultiSelect
			},
			methods: {
				handleAllSelected: handleAllSelected,
				handleAllDeselected: handleAllDeselected,
				handleChanged: handleChanged
			},
			ready: handleReady
		});

		function handleAllSelected(role) {
			addEmployeesToRecipients(role.employees, this.$data.recipients);
			selectEmployees(role.employees);
		}

		function handleAllDeselected(role) {
			removeEmployeesFromRecipients(role.employees, this.$data.recipients);
			deselectEmployees(role.employees);
		}

		function handleChanged(employee, checked) {
			if (checked) {
				addEmployeesToRecipients([employee], this.$data.recipients);
				selectEmployees([employee]);
			} else {
				removeEmployeesFromRecipients([employee], this.$data.recipients);
				deselectEmployees([employee]);
			}
		}

		// @returns: [Role+{employees: [Employee]}]
		function computeRoles() {
			var rolesMap = {};
			_.forEach(this.employees, function(employee) {
				_.forEach(employee.roles, function(role) {
					if (!rolesMap[role.name]) {
						rolesMap[role.name] = role;
						role.employees = [];
					}
					rolesMap[role.name].employees.push(employee);
				});
			});
			return _.values(rolesMap);
		}

		function handleReady() {
			var vueScope = this;
			fetchEmployees()
				.then(function(employees) {
					_.forEach(vueScope.$data.recipients, applyRecipientSelection.bind(employees));
					vueScope.$data.employees = employees;
				})
				.catch(handleError);
		}

		function addEmployeesToRecipients(employees, recipients) {
			_.forEach(employees, function(employee) {
				if (!_.find(recipients, {
						name: employee.name
					})) {
					recipients.push(employee);
				}
			});
		}

		function removeEmployeesFromRecipients(employees, recipients) {
			_.forEach(employees, function(employee) {
				var idx = _.findIndex(recipients, {
					name: employee.name
				});
				if (idx > -1) {
					recipients.splice(idx, 1);
				}
			});
		}

		function selectEmployees(employees) {
			_.forEach(employees, function(employee) {
				employee._selected = true;
			});
		}

		function deselectEmployees(employees) {
			_.forEach(employees, function(employee) {
				employee._selected = false;
			});
		}

		function applyRecipientSelection(employees, recipient) {
			var employee = _.find(employees, {
				name: recipient.employeeId
			});
			employee && (employee._selected = true);
		}

		function fetchEmployees() {
			return q.Promise(function(resolve, reject) {
				jQuery.ajax({
					url: '/ws/integrated/v1/store/employees/',
					method: 'GET',
					success: resolve,
					error: reject
				});
			});
		}

		function nextTick() {
			return q.Promise(function(resolve) {
				Vue.nextTick(resolve);
			});
		}

	});
