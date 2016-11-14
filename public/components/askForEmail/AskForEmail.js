define(['Vue', 'text!components/askForEmail/askForEmail.html'], function(Vue, askForEmailHTML) {
  return AskForEmail;

  function AskForEmail() {
    var $dialog = undefined;

    return {
      replace: false,
      template: askForEmailHTML,
      data: function() {
        return {
          email: undefined,
          validationMsg: undefined
        }
      },
      ready: handleReady,
      methods: {
        handleNotNowClicked: handleNotNowClicked,
        handleOkClicked: handleOkClicked,
        handleCloseClicked: handleCloseClicked
      }
    };
  }

  function handleReady() {
    $dialog = jQuery(this.$el).find('[role="dialog"]');
    $dialog.modal();
  }

  function handleCloseClicked() {
    var vueScope = this;
    $dialog.modal('hide');
    $dialog.on('hidden.bs.modal', function() {
      vueScope.$dispatch('email-edit-closed');
    });
  }

  function handleNotNowClicked(event) {
    var vueScope = this;
    $dialog.modal('hide');
    $dialog.on('hidden.bs.modal', function() {
      vueScope.$dispatch('email-edit-canceled');
    });
  }

  function handleOkClicked() {
    var vueScope = this;
    vueScope.$data.validationMsg = undefined;
    showLoading();

    jQuery.ajax({
      url: '/ws/messagingcenter/updateEmail',
      data: {
        email: vueScope.$data.email || ''
      },
      method: 'POST'
    }).then(function() {
      $dialog.modal('hide');
      vueScope.$dispatch('email-edited', {
        email: vueScope.$data.email
      });
      hideLoading();
    }).fail(function(err) {
      if (err.status === 409) {
        vueScope.$data.validationMsg = err.responseJSON.errors;
      } else {
        handleError(err);
      }
      hideLoading();
    });

    return true;
  }

});
