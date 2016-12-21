define(['Vue', 'text!components/dwRecipientList/dwRecipientList.html'],
	function(Vue, recipientListHTML) {
		return Vue.extend({
			replace: true,
			template: recipientListHTML,
			props: ['recipients', 'enterpriseRecipients'],
			methods: {
				handleRemove: handleRemove,
				handleRemoveAll: handleRemoveAll,
				handleRemoveEnterprise: handleRemoveEnterprise
			}
		});

		function handleRemoveEnterprise(enterpriseRecipient) {
			var idx = _.findIndex(this.$data.enterpriseRecipients, function(target) {
				return target.storeSet === enterpriseRecipient.storeSet &&
					target.role.name === enterpriseRecipient.role.name;
			});
			if (idx > -1) {
				this.$data.enterpriseRecipients.splice(idx, 1);
			}
			enterpriseRecipient.role._selected = false;
		}

		function handleRemove(recipient) {
			var idx = _.findIndex(this.$data.recipients, {
				_storeName: recipient._storeName,
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

			_.forEach(this.$data.enterpriseRecipients, function(enterpriseRecipient) {
				enterpriseRecipient.role._selected = false;
			});
			this.$data.enterpriseRecipients.splice(0, this.$data.enterpriseRecipients.length);

			this.$emit('remove-all');
		}
	});
