const fixtures = {
	'nw.js': {
		abisCheck: [
			['0.30.0', 59],
			['0.33.4', 64],
			['0.37.4', 67],
			['0.39.2', 72]
		],
		versionsCheck: [
			[59, '0.30.0'],
			[64, '0.33.4'],
			[67, '0.38.0'],
			[72, '0.42.0']
		],
		rangeCheck: [
			[108, [
				'0.64.1',
				'0.70.0'
			]],
			[72, [
				'0.38.1',
				'0.42.0'
			]],
			[64, [
				'0.30.1',
				'0.33.4'
			]]
		]
	},
	electron: {
		abisCheck: [
			['3.1.6', 64],
			['4.0.0', 64],
			['4.2.6', 69],
			['5.0.13', 70],
			['6.0.0', 73]
		],
		versionsCheck: [
			[64, '4.0.3'],
			[69, '4.2.12'],
			[70, '5.0.13']
		],
		rangeCheck: [
			[69, [
				'4.0.4',
				'4.2.12'
			]],
			[57, [
				'1.8.0',
				'2.1.0-unsupported.20180809'
			]]
		]
	},
	node: {
		abisCheck: [
			['12.22.12', 72],
			['10.1.0', 64],
			['8.7.0', 57],
			['6.17.0', 48]
		],
		versionsCheck: [
			[64, '10.24.1'],
			[67, '11.15.0'],
			[72, '12.22.12']
		],
		rangeCheck: []
	}
} as const

export default fixtures;
