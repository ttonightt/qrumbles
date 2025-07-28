
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

export const bitLength = n => {

	if (n === 0) return 0;

	return Math.floor(Math.log2(n)) + 1;
};

export const b = (data, pad) => {

	if (typeof data === "number") {

		return data.toString(2).padStart(pad, "0");
	}
	else if (isIntArray(data)) {

		return Array.from(data).map(n => b(n, pad));
	}
		throw new Error("...");
};

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