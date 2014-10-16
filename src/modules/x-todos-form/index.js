var name = 'x-todos-form';

var component = require('jqb-ko-component');

component.register(
	name, 
	require('./template.html'), 
	require('./view-model')
);