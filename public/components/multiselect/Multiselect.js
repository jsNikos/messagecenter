define(['lodash', 'q', 'Vue', 'bootstrap-multiselect'], function(_, q, Vue) {
	var options = {
		allSelectedText: 'All',
		selectAllText: 'All',
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true
	};

	return Vue.extend({
		replace: false,
		template: '<select multiple="multiple"> \n' +
			' <option v-for="element in elements" value={{element[elementKey]}} v-bind:selected="element._selected"> \n' +
			'	{{element[displayProp]}}</option> \n' +
			'</select> \n',
		props: ['elements', 'displayProp', 'elementKey'],
		ready: handleReady
	});

	function handleElementChanged(newVal, oldVal) {
		debugger;  //TODO
	}


	function handleReady() {
		var vueScope = this;


		this.$nextTick(function(){
				this.$watch('elements', handleElementChanged, {deep: true});  //TODO
		});


		var extOptions = _.assign({}, options, {
			onSelectAll: handleAllSelected.bind(this),
			onDeselectAll: handleDeselectAll.bind(this),
			onChange: handleChange.bind(this)
		});

		vueScope.$nextTick(function() {
			jQuery(vueScope.$el).find('select').multiselect(extOptions);
		});
	}

	function handleAllSelected() {
		this.$emit('all-selected');
	}

	function handleDeselectAll() {
		this.$emit('all-deselected');
	}

	function handleChange(option, checked, select) {
		var vueScope = this;
		var targetElement =
			_.find(this.$data.elements, function(element) {
				return element[vueScope.$data.elementKey] === jQuery(option).val();
			});
		this.$emit('selection-changed', targetElement, checked);
	}
});
