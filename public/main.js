// config. require.js
require.config({
  baseUrl: '.',
  paths: {
    Vue: '/webapps/commons/libs/vue.min',
    text: '/webapps/commons/libs/text',
    css: '/webapps/commons/libs/css',    
    AskForEmailComponent: 'AskForEmailComponent'
  },
  map: {
    '*': {
      'css': 'css'
    }
  },
  urlArgs: 'version=' + 1
});
