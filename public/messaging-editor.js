var recipients = [];
var existingRecipients = [];

jQuery(function(){
	require(['app'], function(){});
});

function getStoreEmployees() {
	$('.employees-table').html('');
   	$('.employees-table').hide();
	$('.loading').show();
	var store = $('#storeFilter option:selected').val();
   	$.ajax({
    	method: 'GET',
        url: '/ws/messagingcenter/storeemployees',
        data: {store: store}
	})
   	.done(function (response) {
    	$('.loading').hide();
    	var roles = {};
        $.each(response.employees, function(idx, employee) {
        	var role = employee.defaultRole.name;
        	if (roles[role]) {
        		roles[role].push(employee);
        	} else {
        		roles[role] = [employee];
        	}
        });
        $.each(roles, function(role, employees) {
        	$('<div/>', { class: 'employee-table-line' }).appendTo('.employees-table');
        	$('<div/>', { text: role }).appendTo('.employee-table-line:last');
        	$('<div/>').appendTo('.employee-table-line');
        	$('<select/>').appendTo('.employee-table-line:last div:last');
        	$('<option/>').appendTo('.employee-table-line:last div:last select');
        	$('<option/>', {
        		'data-store': store,
        		'data-store-set': null,
        		'data-role': role,
        		'data-employee-id': 'All',
        		'data-employee-display-name': 'All',
        		text: 'All'
        	}).appendTo('.employee-table-line:last div:last select');

        	$.each(employees, function(idx, employee) {
        		$('<option/>', {
        			'data-store': store,
        			'data-store-set': null,
        			'data-role': role,
        			'data-employee-id': employee.name,
        			'data-employee-display-name': employee.displayName,
        			text: employee.displayName
        		}).appendTo('.employee-table-line:last div:last select');
        	});
        });
        $('.employees-table').show();
   	})
    .fail( function(error) {
    	$('.loading').hide();
    	$('.employees-table').html(error);
        $('.employees-table').show();
    });
}

jQuery(function(){
	jQuery('#tabs').tabs();
	jQuery('.employees-table').on('change', 'select', addRecipient);
	jQuery('#enterprise-role').on('change', addEnterpriseRecipient);
	jQuery('.recipients-panel').on('click', '.remove-btn', removeRecipient);
	jQuery('.clear-all').on('click', removeAllRecipients);
});

function addRecipient(event) {
	var selectedEmployee = jQuery(event.target).find(':selected');
	if (selectedEmployee.val()) {
		var store = selectedEmployee.data('store');
		if (store) {
			store = store.toString();
		}
		var role = selectedEmployee.data('role').toString();
		var employeeId = selectedEmployee.data('employee-id').toString();
		var employeeDisplayName = selectedEmployee.data('employee-display-name').toString();

		if ($('.recipient-box' + (store ? '[data-store="' + store + '"]' : '') + '[data-role="' + role + '"][data-employee-id="' + employeeId + '"]').length !== 0) {
			return;
		}

		var recipient = {storeSet: null, store: store, role: role, employeeId: employeeId, employeeDisplayName: employeeDisplayName};
		addRecipientBox(recipient);

		recipients.push(recipient);
		jQuery(event.target).val('');
	}
}

function addEnterpriseRecipient(event) {
	var role = jQuery(event.target).find(':selected').val();
	var storeSet = $('#enterprise-storeSet').find(':selected').val();
	if (storeSet === null || storeSet === '' || role === null || role === '') {
		return;
	}

	if ($('.recipient-box[data-store-set="' + storeSet + '"][data-role="' + role + '"]').length !== 0) {
		return;
	}

	var recipient = {storeSet: storeSet, store: null, role: role, employeeId: null, employeeDisplayName: 'All'};
	addRecipientBox(recipient);

	recipients.push(recipient);
	jQuery(event.target).val('');
}

function addRecipientBox(recipient) {
	var boxText;
	if (recipient.storeSet) {
		boxText = recipient.storeSet + ' ' + recipient.role;
	} else if (recipient.store) {
		boxText = recipient.store + ': ' + recipient.role + ': ' + recipient.employeeDisplayName;
	} else {
		boxText = recipient.role + ': ' + recipient.employeeDisplayName;
	}
	$('<span>', {
		class: 'recipient-box',
		'data-store': recipient.store,
		'data-store-set': recipient.storeSet,
		'data-role': recipient.role,
		'data-employee-id': recipient.employeeId,
		text: boxText
	}).appendTo('.recipients-panel');
	$('<span>', {
		class: 'remove-btn',
		text: 'X'
	}).appendTo('.recipient-box:last');
}

function removeRecipient(event) {
	var recipientBox = jQuery(event.target).parent();

	var storeSet = recipientBox.data('store-set');
	if (storeSet) {
		storeSet = storeSet.toString();
	}

	var store = recipientBox.data('store');
	if (store) {
		store = store.toString();
	}

	var role = recipientBox.data('role');
	if (role) {
		role = role.toString();
	}

	var employeeId = recipientBox.data('employee-id');
	if (employeeId) {
		employeeId = employeeId.toString();
	}

	recipientBox.remove();
	recipients = $.grep(recipients, function(recipient) {
		if (storeSet) {
			return !(recipient.storeSet === storeSet && recipient.role === role);
		} else if (store) {
			return !(recipient.store === store && recipient.role === role && recipient.employeeId === employeeId);
		} else {
			return !(recipient.role === role && recipient.employeeId === employeeId);
		}
	});
}

function removeAllRecipients() {
	$('.recipient-box').remove();
	recipients = [];
}

function initRecipientsPanel(_existingRecipients) {
	existingRecipients = _existingRecipients;
	$.each(existingRecipients, function(idx, existingRecipient) {
		$('<span>', {
			class: 'recipient-box',
			'data-store': existingRecipient.store,
			'data-role': existingRecipient.role,
			'data-employee-id': existingRecipient.employeeId,
			text: (existingRecipient.store ? existingRecipient.store + ': ' : '') + existingRecipient.role + ': ' + existingRecipient.employeeDisplayName
		}).appendTo('.recipients-panel');
		$('<span>', {
			class: 'remove-btn',
			text: 'X'
		}).appendTo('.recipient-box:last');

		recipients.push(existingRecipient);
	});
}

function appendRecipientsToForm() {
	$('<input>').attr({
		type: 'hidden',
		name: 'recipients',
		value: JSON.stringify(recipients)
	}).appendTo('form');
	return true;
}
