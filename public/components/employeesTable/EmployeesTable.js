define(['text!components/employeesTable/employeesTable.html', 'lodash', 'q', 'Vue', 'MultiSelect'],
	function(employeesTableHTML, _, q, Vue, MultiSelect) {
		var component = Vue.extend({
			replace: false,
			template: employeesTableHTML,
			props: ['recipients', 'employees'],
			data: function() {
				return {
					roleEmployee: undefined // {roleName -> [Employees]}
				}
			},
			watch: {
				'employees': {
					handler: handleEmployeesChanged,
					deep: true
				}
			},
			computed: {
				roles: computeRoles, // [Role]
			},
			components: {
				multiselect: MultiSelect.component
			},
			methods: {
				handleAllSelected: handleAllSelected,
				handleAllDeselected: handleAllDeselected,
				handleChanged: handleChanged
			}
		});

		return {
			component: component
		};

		function handleEmployeesChanged() {
			this.$data.roleEmployee = computeRoleEmployee.call(this);
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
				var role = employee.defaultRole;
				var roleExists = _.find(roles, {
					name: role.name
				});
				if (!roleExists) {
					roles.push(role);
				}
			});
			return roles;
		}

		function computeRoleEmployee() {
			var roleEmployee = {};
			_.forEach(this.$data.employees, function(employee) {
				var role = employee.defaultRole;
				if (!roleEmployee[role.name]) {
					roleEmployee[role.name] = [];
				}
				roleEmployee[role.name].push(employee);
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

		function nextTick() {
			return q.Promise(function(resolve) {
				Vue.nextTick(resolve);
			});
		}

	});
