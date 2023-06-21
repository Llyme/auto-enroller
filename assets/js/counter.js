/**
 * Recyclable UID generator.
**/
let hi = 0;
let lo = [];

module.exports = i => {
	if (i == null)
		return lo.length ?
			lo.pop() :
			hi++;
	else (
		i >= hi ? (
			i < hi-1 ?
			lo.push(i) :
			hi--
		) : 0
	);
};
