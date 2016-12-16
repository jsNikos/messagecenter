define(['text!components/employeesTable/employeesTable.html', 'lodash', 'q', 'Vue', 'MultiSelect'],
	function(employeesTableHTML, _, q, Vue, MultiSelect) {
		return Vue.extend({
			replace: false,
			template: employeesTableHTML,
			props: ['recipients'],
			data: function() {
				return {
					employees: undefined,
					roles: undefined, // [Roles]
					roleEmployee: undefined // {roleName -> [Employees]}
				}
			},
			watch: {
				'employees': {
					handler: handleEmployeesChanged,
					deep: true
				}
			},
			components: {
				multiselect: MultiSelect.component
			},
			methods: {
				handleAllSelected: handleAllSelected,
				handleAllDeselected: handleAllDeselected,
				handleChanged: handleChanged
			},
			ready: handleReady
		});

		function handleReady() {
			var vueScope = this;
			fetchEmployees()
				.then(function(employees) {
					_.forEach(employees, enricheEmployee);
					_.forEach(vueScope.$data.recipients, applyRecipientSelection.bind(employees));
					vueScope.$data.employees = employees;
					vueScope.$data.roles = computeRoles.call(vueScope);
					vueScope.$data.roleEmployee = computeRoleEmployee.call(vueScope);
				})
				.catch(handleError);
		}

		function handleEmployeesChanged() {
			this.$broadcast(MultiSelect.topics.REFRESH_SELECTS);
		}

		function enricheEmployee(employee) {
			employee._selected = false;
		}

		function handleAllSelected(role) {
			var selectedEmployees = this.$data.roleEmployee[role.name];
			addEmployeesToRecipients(selectedEmployees, this.$data.recipients);
			selectEmployees(selectedEmployees);
		}

		function handleAllDeselected(role) {
			var deselectedEmployees = this.$data.roleEmployee[role.name];
			removeEmployeesFromRecipients(deselectedEmployees, this.$data.recipients);
			deselectEmployees(deselectedEmployees);
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

		function computeRoles() {
			var roles = [];
			_.forEach(this.$data.employees, function(employee) {
				_.forEach(employee.roles, function(role) {
					if (!_.find(roles, {
							name: role.name
						})) {
						roles.push(role);
					}
				});
			});
			return roles;
		}

		function computeRoleEmployee() {
			var roleEmployee = {};
			_.forEach(this.$data.employees, function(employee) {
				_.forEach(employee.roles, function(role) {
					if (!roleEmployee[role.name]) {
						roleEmployee[role.name] = [];
					}
					roleEmployee[role.name].push(employee);
				})
			});
			return roleEmployee;
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
