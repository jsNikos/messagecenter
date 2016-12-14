define(['Vue', 'text!components/recipientList/recipientList.html'], function(Vue, recipientListHTML){
	return Vue.extend({
		replace: true,
		template: recipientListHTML,
		props: ['recipients']
	});

});
