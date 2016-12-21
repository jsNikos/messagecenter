// config. require.js
require.config({
  baseUrl: window.baseUrl || '/webapps/messagecenter',
  paths: {
    Vue: '/webapps/commons/libs/vue',
    text: '/webapps/commons/libs/text',
    css: '/webapps/commons/libs/css',
    q: '/webapps/commons/libs/q',
		lodash: '/webapps/commons/libs/lodash',
    app: 'app',
		'app-dw': 'app-dw',
    AskForEmail: 'components/askForEmail/AskForEmail',
    ConfirmDialog: 'components/confirmDialog/ConfirmDialog',
		EmployeesTable: 'components/employeesTable/EmployeesTable',
		'bootstrap-multiselect': 'libs/bootstrap-multiselect/dist/js/bootstrap-multiselect',
		MultiSelect: 'components/multiselect/MultiSelect',
		RecipientList: 'components/recipientList/RecipientList',
		DwRecipientList: 'components/dwRecipientList/DwRecipientList',
		apiService: 'services/apiService',
		MessageCenterService: 'services/MessageCenterService',
		utils: 'utils/utils'
  },
	shim: {
		'bootstrap-multiselect': {
			deps: ['css!libs/bootstrap-multiselect/dist/css/bootstrap-multiselect']
		}
	},
  map: {
    '*': {
      'css': 'css'
    }
  },
  urlArgs: 'version=' + (window.releaseVersion || '')
});
