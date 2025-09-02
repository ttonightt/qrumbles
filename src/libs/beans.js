
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

export const getIntArrayBase = arr => {

	if ( isInt8Array(arr) ) return 8;
	if ( isInt16Array(arr) ) return 16;
	if ( isInt32Array(arr) ) return 32;

	throw "given array doesn't belong to typed int arrays!";
};

export const bitLength = n => {

	if (n === 0) return 0;

	return Math.floor(Math.log2(n)) + 1;
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

export const bitOffset8 = (ff) => {

	return [
		ff % 8,
		Math.floor(ff / 8),
		8 - (ff % 8)
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