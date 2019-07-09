module.exports = (req, res) => {
	console.log(req.query);

	const {mode, runtime, target, abi} = req.query;

	switch (mode) {

	}

	res.send('OK');
};
