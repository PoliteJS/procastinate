var name = 'x-todos-list';

var component = require('jqb-ko-component');

component.register(
	name, 
	require('./template.html'), 
	require('./view-model')
);