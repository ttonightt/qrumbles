
export const isIntArray = arr => (
	arr instanceof Int8Array ||
	arr instanceof Uint8Array ||
	arr instanceof Uint8ClampedArray ||
	arr instanceof Int16Array ||
	arr instanceof Uint16Array ||
	arr instanceof Int32Array ||
	arr instanceof Uint32Array
);

export const isInt8Array = arr => (
	arr instanceof Int8Array ||
	arr instanceof Uint8Array ||
	arr instanceof Uint8ClampedArray
);

export const isInt16Array = arr => (
	arr instanceof Int16Array ||
	arr instanceof Uint16Array
);

export const isInt32Array = arr => (
	arr instanceof Int32Array ||
	arr instanceof Uint32Array
);

export const isFloatArray = arr => (
	arr instanceof Float32Array ||
	arr instanceof Float64Array
);

export const isBigIntArray = arr => (
	arr instanceof BigInt64Array ||
	arr instanceof BigUint64Array
);

export const isTypedArray = arr => (
	isIntArray(arr) ||
	isFloatArray(arr) ||
	isBigIntArray(arr)
);

export const isAnyArray = x => (
	Array.isArray(x) ||
	isTypedArray(x)
);

export const isIterable = x => (
	typeof x === "string" ||
	Array.isArray(x) ||
	isTypedArray(x)
);

export const getIntArrayBase = arr => {

	if ( isInt8Array(arr) ) return 8;
	if ( isInt16Array(arr) ) return 16;
	if ( isInt32Array(arr) ) return 32;

	throw "given array doesn't belong to typed int arrays!";
};

export const digits = (n, radix = 10) => {

	if (n === 0) return 1;

	switch (radix) {
		case 0: case 1: case 2:
			return Math.floor( Math.log2(n) ) + 1;
		case 10:
			return Math.floor( Math.log10(n) ) + 1;
		default:
			return Math.floor( Math.log(n) / Math.log(radix) ) + 1;
	}
};

const __b = (data, pad, I) => {

	if (I > 10) return data;

	if (typeof data === "number") {

		return data.toString(2).padStart(pad, "0");
	}

	if ( Array.isArray(data) || isIntArray(data) ) {

		const arr = [];

		for (let i = 0; i < data.length; i++) {

			arr.push( __b(data[i], pad, I + 1) );
		}

		return arr;
	}

	return data;
};

export const b = (data, pad) => __b(data, pad, 0);

export const clearLastBits = (num, bitLength) => {

	return (num >> bitLength) << bitLength;
};

export const hammingDistance = (a, b) => {

	if (a === b) return 0;

	a ^= b;
	b = 0;

	while (a > 0) {
		if (a % 2) {
			b++;
		}

		a >>= 1;
	}

	return b;
};

export const generateNearestValid = (code, max) => {

	const variants = [];

	for (let i = 0; i < 11; i++) {

		const code_ = code ^ (1 << i);

		if ((code >> i) % 2 && code_ < max) 

			variants.push(code_);
	}

	return variants;
};

export const putBits = (trg, src, blen, ffe, ffe0 = 0) => {

	const ff = blen + ffe;

	if (ffe0 < 0) {

		src <<= -ffe0;
	} else 
		src >>= ffe0;

	src %= 1 << blen;

	return (
		((trg >> ff) << ff) +
		(src << ffe) +
		(trg % (1 << ffe))
	);
};

export const sliceBits = (num, blen, ffe) => {

	return (num >> ffe) % (1 << blen);
};

export const ones = n => (1 << n) - 1;

export const b8 = data => b(data, 8);

export const binole = {

	__2bin (args) {

		return args.map(item => {

			const num = parseInt(item);

			if (isNaN(num)) {

				return item;
			} else 
				return b(num);
		});
	},

	log (...args) {

		return console.log(...this.__2bin(args));
	},

	error (...args) {

		return console.error(...this.__2bin(args));
	},

	warn (...args) {

		return console.warn(...this.__2bin(args));
	}
};

export const bitOffset = (ff, base) => {

	return [
		ff % base,
		Math.floor(ff / base),
		base - (ff % base)
	];
}



export const destructByBase = (num, ...bases) => {

	const pieces = [];

	let buff = 1;

	for (let i = 0; i < bases.length; i++) {

		pieces.push((num % bases[i]) * buff);
		num = Math.floor(num / bases[i]);

		buff *= bases[i];
	}

	pieces.push(num * buff);

	return pieces.reverse();
};

export const splitByBase = (num, ...bases) => {

	const pieces = [];

	let buff = 1;

	for (let i = 0; i < bases.length; i++) {

		pieces.push(num % bases[i]);
		num = Math.floor(num / bases[i]);

		buff *= bases[i];
	}

	pieces.push(num);

	return pieces.reverse();
};


export const choose = ( x, cases, values, defaultValue ) => {

	if ( !(cases.length && values.length && cases.length === values.length) )

		throw `cases and values arguments are not arrays, have zero length or their lengths don't match!`;

	for (let i = 0; i < cases.length; i++) {

		if ( cases[i] === x ) {

			return values[i];
		}
	}

	return defaultValue;
};

export const chooseSlope = ( x, points, values, including = false, defaultValue ) => {

	if ( !(points.length && values.length && points.length === values.length + 1) )

		throw `cases and values arguments are not arrays, have zero length or their lengths don't match!`;

	if ( including ? x <= points[0] : x < points[0] ) {

		return defaultValue;
	}

	for (let i = 1; i < points.length; i++) {

		if ( including ? ( x <= points[i] ) : ( x < points[i] ) ) {

			return values[i - 1];
		}
	}

	return defaultValue;
};

export const throwError = error => { throw error };

export const minmax = (...n) => {

	let min = n[0], max = n[0];

	for (let i = 0; i < n.length; i++) {

		if (n[i] < min) min = n[i];
		if (n[i] > max) max = n[i];
	}

	return [min, max];
};

export const rand = (near, far) => {

	const x = Math.random();

	if ( near !== undefined ) {

		if (typeof near === "number") {

			if ( far !== undefined ) {

				if (typeof far === "number") {

					return x * (far - near) + near;
				}

				throw `the second argument must be a number! Got: ${far}`;
			}

			return x * near;
		}

		throw `the second argument must be a number! Got: ${near}`;
	}

	return x;
};

export const randFrom = (iterable, near, far) => {

	const x = Math.random();

	if ( isIterable( iterable ) ) {

		if ( near !== undefined ) {

			if (near < iterable.length - 1) {

				if ( far !== undefined ) {

					if (far < iterable.length - 1) {

						return iterable[ Math.floor( x * (far - near - 1) + near ) ];
					}

					throw `the second argument must be a number! Got: ${far}`;
				}

				return iterable[ Math.round( x * (near - 1) ) ];
			}

			throw `the second argument must be a number! Got: ${near}`;
		}

		return iterable[ Math.floor( x * (iterable.length - 1) ) ];
	}

	throw `the first argument must be an array, typed array or string Got: ${iterable}!`;
};

export const Gen = (Cls, length, fn) => {

	if ( isAnyArray( Cls.prototype ) ) {

		const arr = new Cls(length);

		for (let i = 0; i < length; i++) {

			arr[i] = fn(i, arr);
		}

		return arr;
	}
	
	if ( Cls === String ) {

		let str = "";

		for (let i = 0; i < length; i++) {

			str += fn(i, str);
		}

		return str;
	}

	throw `Only iterable class can be passed! Got: ${Cls}`;
};