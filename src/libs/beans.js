
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

export const splitByBase = (bitOffset, bitLength, baseLength) => {

	const bitsBeforeOffset = bitOffset % baseLength;
	const bitsAfterOffset = baseLength - bitsBeforeOffset;

	const bitEndOffset = bitOffset + bitLength;

	const bitsBeforeEndOffset = bitEndOffset % baseLength;
	const bitsAfterEndOffset = baseLength - bitsBeforeEndOffset;

	return [
		Math.floor(bitOffset / baseLength),
		bitsBeforeOffset,
		bitsAfterOffset,
		(bitLength - bitsAfterOffset - bitsBeforeEndOffset) / baseLength,
		bitsBeforeEndOffset,
		bitsAfterEndOffset,
		Math.floor(bitEndOffset / baseLength)
	];
};

const splitted = splitByBase(11, 15, 8);

console.log(splitted);
console.log("|1 0 1 0 0 1 0 0|0 1 0 1 1 1 0 0|1 1 1 0 0 0 1 0|0 1 0 0 0 0 0 0|1 1 0 1 1 1 0 1|");

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