
var dbox = require('dbox');

module.exports = {
	init: function() {
		this.status = ko.observable(false);

		this.display = ko.computed(function() {
			if (this.status()) {
				return 'Log Out';
			} else {
				return 'Connect to Dropbox';
			}
		}, this);

		this._status = dbox.service.watchStatus(this.status);
	},
	dispose: function() {
		this.display.dispose();
		this._status.dispose();
	},
	clickHandler: function() {
		if (this.status()) {
			dbox.service.disconnect();
		} else {
			dbox.service.connect();
		}
	}
};
