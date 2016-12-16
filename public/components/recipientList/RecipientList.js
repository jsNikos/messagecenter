define(['Vue', 'text!components/recipientList/recipientList.html'], function(Vue, recipientListHTML){
	return Vue.extend({
		replace: true,
		template: recipientListHTML,
		props: ['recipients'],
		methods: {
			handleRemove: handleRemove,
			handleRemoveAll: handleRemoveAll
		}
	});

	function handleRemove(recipient) {
		this.$emit('remove-recipient', recipient);
	}

	function handleRemoveAll(){
		this.$emit('remove-all');
	}

});
