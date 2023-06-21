module.exports = function() {
	let on = {};
	let once = {};

	this.on = (channel, listener) => {
		if (!on[channel])
			on[channel] = [];

		on[channel].push(listener);
	};

	this.once = (channel, listener) => {
		if (!once[channel])
			once[channel] = [];

		once[channel].push(listener);
	};

	this.removeListener = (channel, listener) => {
		[on, once].map(v => {
			if (v[channel]) {
				let i = v[channel].indexOf(listener);

				if (i != -1)
					v[channel].splice(i, 1);
			}
		});
	};

	this.fire = (channel, args) => {
		if (once[channel]) {
			let l = Object.assign([], once[channel]);
			delete once[channel];

			l.map(v => v(args));
		}

		if (on[channel])
			on[channel].map(v => v(args));
	};
};