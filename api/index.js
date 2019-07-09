const abis = require('../src');

module.exports = async (req, res) => {
	console.log(req.query);

	const {mode, runtime, target, abi} = req.query;

	switch (mode) {
		case 'range':
			if (runtime && abi) {
				const versions = await abis.getRange(runtime, parseInt(abi, 10));
				console.log(versions);
				res.json(versions);
			} else {
				res.end('required: runtime, abi');
			}

			break;
		case 'abi':
			break;
		case 'target':
			break;
		default:
			res.end('Unsupported mode, try one of: range');
			break;
	}

	res.end('OK');
};
