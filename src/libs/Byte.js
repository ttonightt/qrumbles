import { b, b8, binole, bitLength, choose, chooseSlope, destructByBase, sliceBits, splitByBase, throwError } from "./beans";
import { BinaryAsArray } from "./BinaryAsArray";

export const Windows1250 = {

	__ref: "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\u20ac\x81\u201a\x83\u201e\u2026\u2020\u2021\x88\u2030\u0160\u2039\u015a\u0164\u017d\u0179\x90\u2018\u2019\u201c\u201d\u2022\u2013\u2014\x98\u2122\u0161\u203a\u015b\u0165\u017e\u017a\xa0\u02c7\u02d8\u0141\xa4\u0104\xa6\xa7\xa8\xa9\u015e\xab\xac\xad\xae\u017b\xb0\xb1\u02db\u0142\xb4\xb5\xb6\xb7\xb8\u0105\u015f\xbb\u013d\u02dd\u013e\u017c\u0154\xc1\xc2\u0102\xc4\u0139\u0106\xc7\u010c\xc9\u0118\xcb\u011a\xcd\xce\u010e\u0110\u0143\u0147\xd3\xd4\u0150\xd6\xd7\u0158\u016e\xda\u0170\xdc\xdd\u0162\xdf\u0155\xe1\xe2\u0103\xe4\u013a\u0107\xe7\u010d\xe9\u0119\xeb\u011b\xed\xee\u010f\u0111\u0144\u0148\xf3\xf4\u0151\xf6\xf7\u0159\u016f\xfa\u0171\xfc\xfd\u0163\u02d9",

	charToCode (c) {

		return this.__ref.indexOf(c);
	},

	codeToChar (i) {

		return this.__ref[i];
	}
};

export const Windows1251 = {

	__ref: "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\x98\u2122\u0459\u203a\u045a\u045c\u045b\u045f\xa0\u040e\u045e\u0408\xa4\u0490\xa6\xa7\u0401\xa9\u0404\xab\xac\xad\xae\u0407\xb0\xb1\u0406\u0456\u0491\xb5\xb6\xb7\u0451\u2116\u0454\xbb\u0458\u0405\u0455\u0457\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f",

	charToCode (c) {

		return this.__ref.indexOf(c);
	},

	codeToChar (i) {

		return this.__ref[i];
	}
};

const Latin1 = {
	charToCode (c) { return c.charCodeAt(0) },
	codeToChar (code) { return String.fromCharCode(code) }
};

export const Latin2 = {

	__ref: "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0\u0104\u02D8\u0141\xa4\u013D\u015A\xa7\xa8\u0160\u015E\u0164\u0179\xad\u017D\u017B\xb0\u0105\u02DB\u0142\xb4\u013E\u015B\u02C7\xb8\u0161\u015F\u0165\u017A\u02DD\u017E\u017C\u0154\xc1\xc2\u0102\xc4\u0139\u0106\xc7\u010C\xc9\u0118\xcb\u011A\xcd\xce\u010E\u0110\u0143\u0147\xd3\xd4\u0150\xd6\xd7\u0158\u016E\xda\u0170\xdc\xdd\u0162\xdf\u0155\xe1\xe2\u0103\xe4\u013A\u0107\xe7\u010D\xe9\u0119\xeb\u011B\xed\xee\u010F\u0111\u0144\u0148\xf3\xf4\u0151\xf6\xf7\u0159\u016F\xfa\u0171\xfc\xfd\u0163\u02D9",

	charToCode (c) {

		return this.__ref.indexOf(c);
	},

	codeToChar (i) {

		return this.__ref[i];
	}
};


export const Byte = {

	prefix (version, len) {

		if (version < 1 || 40 < version) throw new Error("...");
		if (len < 1) throw new Error("...");

		const counterBitLength = version < 10 ? 8 : 16;

		const bins = new BinaryAsArray(4 + counterBitLength);

		bins.type = "byte-prefix";
		bins.counterBitLength = counterBitLength;

		bins.setInt(0, 4, 0b0100);
		bins.setInt(4, counterBitLength, len);

		return bins;
	},

	prefixECI (encoding) {

		const bins = new BinaryAsArray(12);

		bins.type = "eci-prefix";

		bins.setInt(0, 4, 0b0111);

		switch (encoding) {
			case "latin1":
				bins.setInt(4, 8, 3);
				break;
			case "latin2":
				bins.setInt(4, 8, 4);
				break;
			case "windows1250":
				bins.setInt(4, 8, 21);
				break;
			case "windows1251":
				bins.setInt(4, 8, 22);
		}

		return bins;
	}
};

export class ByteArray extends BinaryAsArray {

	static supportedEncoding = [
		"latin1", "latin2", "windows1250", "windows1251"
	]

	static skippedCharacters ={
		"latin1": [0],
		"latin2": [0],
		"windows1250": [0],
		"windows1251": [0],
	}

	constructor (len, encodingName) {

		super(len * 8);

		this.encodingName = encodingName;

		this.encoding =
			choose( this.encodingName,
				[ "latin1", "latin2", "windows1250", "windows1251" ],
				[
					Latin1,
					Latin2,
					Windows1250,
					Windows1251
				]
			) ?? throwError(`ByteArray doesn't support encoding ${encodingName}. List of supported encoding: ${ByteArray.supportedEncoding}`);

		this.type = "byte";
		this.length = len;
		this.base = 8;
		this.charbase = 1;

		this.lastBlockBase = 8;
		this.lastBlockCharbase = 1;
	}

	setStr (i, str) {

		const len = Math.min( str.length, this.bytes.length - i );

		for (let j = 0; j < len; j++) {

			this.bytes[ i + j ] = this.encoding.charToCode( str[j] );
		}

		return this;
	}

	getStr (i, len) {

		let str = "";

		const ie = Math.min( len + i, this.bytes.length );

		for (i; i < ie; i++) {

			str += this.encoding.codeToChar( this.bytes[i] );
		}

		return str;
	}

	validate () {

		const mistakes = [];

		for (let i = 0; i < this.bytes.length; i++) {

			const code = this.bytes[i];

			if (Byte.skippedCharacters[this.encoding].includes(code)) {

				mistakes.push({
					value: code,
					blockIndex: i,
					bitLength: 8
				});
			}
		}

		return mistakes;
	}

	toUintArray () {

		return new Uint8Array(this.bytes);
	}
}

export class UTF16ByteArray extends BinaryAsArray {

	constructor (len) {

		super(len * 16);

		this.encodingName = "utf16";

		this.type = "byte";
		this.length = len;
		this.base = 16;
	}

	setStr (i, str) {

		const len = Math.min( str.length, this.length - i );

		for (let j = 0; j < len; j++) {

			const utf16 = str[j].charCodeAt(0);

			this.bytes[ (i + j) * 2 ] = utf16 >> 8;
			this.bytes[ (i + j) * 2 + 1 ] = utf16 % 256;
		}

		return this;
	}

	getStr (i, len) {

		let str = "";

		const je = Math.min( len + i, this.length ) * 2;

		for (let j = i * 2; j < je; j += 2) {

			str += String.fromCharCode( (this.bytes[j] << 8) + this.bytes[j + 1] );
		}

		return str;
	}
}


export const UTF8 = {

	getByteLength (c) {

		const utf16 = c.charCodeAt(0);

		return chooseSlope( bitLength(utf16), [0, 7, 11, 16], [1, 2, 3], true );
	},

	charToCode (c) {

		if ( c.length > 1 ) `c argument must be a string with length of 1! got: ${c.length}\nYou might try to pass the unicode character instead of UTF16 as well`;

		const utf16 = c.charCodeAt(0);

		if (utf16 < 0x80) {

			const codes= new Uint8Array(1);

			codes[0] = utf16;

			return codes;
		}
		if (utf16 < 0x800) {

			const codes = new Uint8Array( splitByBase(utf16, 0x40) );

			codes[0] += 0b11000000;
			codes[1] += 0b10000000;

			return codes;
		}
		if (utf16 < 0x10000) {

			const codes = new Uint8Array( splitByBase(utf16, 0x40, 0x40) );

			codes[0] += 0b11100000;
			codes[1] += 0b10000000;
			codes[2] += 0b10000000;

			return codes;
		}
	},

	codeToChar (codes) {
		
		if ( codes.length === 1 ) {

			if ( (codes[0] & 0xc0) === 0 )

				return String.fromCharCode( codes[0] );

			throw `malformed utf8 code! got: ${b8(codes)}`;
		}
		if ( codes.length === 2 ) {

			if ( (codes[0] & 0xe0) === 0xc0 && (codes[1] & 0xc0) === 0x80 )

				return String.fromCharCode( ( (codes[0] & 0x1f) << 6 ) + (codes[1] & 0x3f) );

			throw `malformed utf8 code! got: ${b8(codes)}`;
		}
		if ( codes.length === 3 ) {

			if ( (codes[0] & 0xf0) === 0xe0 && (codes[1] & 0xc0) === 0x80 && (codes[2] & 0xc0) === 0x80 )

				return String.fromCharCode( ( (codes[0] & 0x0f) << 12 ) + ( (codes[1] & 0x3f) << 6 ) + (codes[2] & 0x3f) );

			throw `malformed utf8 code! got: ${b8(codes)}`;
		}

		throw `malformed utf8 code! got: ${b8(codes)}`;
	}
};

export class UTF8ByteArray extends BinaryAsArray {

	constructor (len) {

		super(len * 8);

		this.encodingName = "utf8";

		this.type = "byte";
		this.length = len;
		this.base = 8;
	}

	setStr (i, str) {

		const arr = [];

		const len = Math.min( str.length, this.length - i );

		let k = 0;

		for (let j = 0; j < len; j++) {

			const utf16 = str[j].charCodeAt(0);

			arr[k++]
		}

		return this;
	}

	getStr (i, len) {

		let str = "";

		const je = Math.min( len + i, this.length ) * 2;

		for (let j = i * 2; j < je; j += 2) {

			str += String.fromCharCode( (this.bytes[j] << 8) + this.bytes[j + 1] );
		}

		return str;
	}
}