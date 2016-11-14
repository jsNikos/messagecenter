// config. require.js
require.config({
  baseUrl: window.baseUrl || '/webapps/messagecenter',
  paths: {
    Vue: '/webapps/commons/libs/vue.min',
    text: '/webapps/commons/libs/text',
    css: '/webapps/commons/libs/css',
    q: '/webapps/commons/libs/q',
    app: 'app',
    AskForEmail: 'components/askForEmail/AskForEmail',
    ConfirmDialog: 'components/confirmDialog/ConfirmDialog'
  },
  map: {
    '*': {
      'css': 'css'
    }
  },
  urlArgs: 'version=' + (window.releaseVersion || '')
});
