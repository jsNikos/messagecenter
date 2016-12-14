define(['Vue', 'q', 'EmployeesTable', 'RecipientList'],
function(Vue, q, EmployeesTable, RecipientList) {
  return new MessageCenterApp();

  function MessageCenterApp() {
    Vue.config.debug = true;
    var vueScope = undefined;

    new Vue({
      el: '#messageCenterApp',
      data: {
        showLoading: false,
        emailDelivery: undefined,
        employeeHasEmail: window.employeeHasEmail,
        submitAction: undefined,
				recipients: []  // [Employee]
      },
      ready: handleReady,
			components: {
				'employees-table': EmployeesTable,
				'recipient-list': RecipientList
			},
      methods: {
        handleSendClicked: handleSendClicked,
        handleSaveClicked: handleSaveClicked,
        handleDeleteClicked: handleDeleteClicked
      }
    });

    function handleReady() {
      vueScope = this;

      window.showLoading = function() {
        vueScope.$data.showLoading = true;
      }

      window.hideLoading = function() {
        vueScope.$data.showLoading = false;
      }
    }

  function handleSaveClicked() {
    this.$data.submitAction = 'Save';
    if (!this.$data.employeeHasEmail && this.$data.emailDelivery) {
      askForEmail().then(submitForm);
    } else {
      submitForm();
    }
  }

  function handleDeleteClicked() {
    this.$data.submitAction = 'Delete';
    confirmDelete()
      .then(submitForm)
      .catch(handleError);
  }

  function handleSendClicked(event) {
    this.$data.submitAction = 'Send';
    if (!this.$data.employeeHasEmail && this.$data.emailDelivery) {
      askForEmail()
        .then(submitForm)
        .catch(handleError);
    } else {
      submitForm();
    }
  }

  function askForEmail() {
    return q.Promise(function(resolve, reject) {
      require(['AskForEmail'], function(AskForEmail) {
        var el = jQuery('<div><ask-for-email></ask-for-email></div>').appendTo('body').get(0);
        var vue = new Vue({
          el: el,
          components: {
            'ask-for-email': new AskForEmail()
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
            'confirm-delete': new ConfirmDialog()
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

  function submitForm() {
    vueScope.$nextTick(function() {
      jQuery('form[name="MessageEditor"]').submit();
    });
  }
}

});
