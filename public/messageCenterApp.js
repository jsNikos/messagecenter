define(['AskForEmailComponent', 'Vue'], function(AskForEmailComponent, Vue) {

  function MessageCenterApp() {
    Vue.config.debug = true
    var vueScope = undefined;

    new Vue({
      el: '#messageCenterApp',
      data: {
        showAskForEmail: true,
        showLoading: false
      },
      components: {
        'ask-for-email': new AskForEmailComponent()
      },
      events: {
        'email-edit-canceled': handleEmailEditCanceled,
        'email-edited': handleEmailEdited
      },
      ready: handleReady
    });

    function handleReady() {
      vueScope = this;
    }

    function handleEmailEditCanceled() {
      this.$data.showAskForEmail = false;
      console.log('canceled');
      //TODO
    }

    function handleEmailEdited() {
      this.$data.showAskForEmail = false;
      console.log('email edit');
      //TODO
    }

    window.handleError = function(err) {
        window.console && console.log(err);
    };

    window.showLoading = function() {
      vueScope.$data.showLoading = true;
    }

    window.hideLoading = function() {
      vueScope.$data.showLoading = false;
    }

  }

  return new MessageCenterApp();
});
