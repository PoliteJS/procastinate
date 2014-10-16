var name = 'x-todos-item';

var component = require('jqb-ko-component');

component.register(
	name, 
	require('./template.html'), 
	require('./view-model')
);