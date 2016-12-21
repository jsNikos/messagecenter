define(['Vue', 'text!components/recipientList/recipientList.html'], function(Vue, recipientListHTML) {
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
		var idx = _.findIndex(this.$data.recipients, {
			name: recipient.name
		});
		if (idx > -1) {
			this.$data.recipients.splice(idx, 1);
		}
		recipient._selected = false;
	}

	function handleRemoveAll() {
		_.forEach(this.$data.recipients, function(recipient) {
			recipient._selected = false;
		});
		this.$data.recipients.splice(0, this.$data.recipients.length);
	}

});
