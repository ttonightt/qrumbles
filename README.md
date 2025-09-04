# API
### BinaryAsArray
### `static`
`static transferBits( target, source, t0, bitLength, s0 )` *: undefined*
- ***target** : BinaryAsArray | Int8Array | Uint8Aray | Uint8ClampedArray*
- ***source** : BinaryAsArray | Int8Array | Uint8Aray | Uint8ClampedArray*
- ***t0** : Number* ( 0 <= x < target bit length )
- *? **bitLength** : Number* ( 0 < x )
- ***s0** : Number* ( 0 <= x < source.bitLength ) ; default value: `0`

```
                        bitLength = 10
                      s0 = 4 │
                      ↓      │
source:           101011010101010
                      ↓↓↓↓↓↓↓│↓↓
					  ┌──────┴─┐
target:  11101000111100011010010100110
                      ↑
                      t0 = 13
```

`static join( ...sources )` *: BinaryAsArray*
- ***sources** : [ BinaryAsArray | Int8Array | Uint8Aray | Uint8ClampedArray ]*

`static from( source, bitLength )` *: BinaryAsArray*
- ***source** : BinaryAsArray | Int8Array | Uint8Aray | Uint8ClampedArray*
- ***bitLength** : Number* ( 0 < x )

### `constructor ( bitLength )`
- ***bitLength** : Number* ( 0 < x )

`setInt( int, t0, blen )` *: BinaryAsArray*
- ***int** : Number*
- ***t0** : Number* ( 0 <= x < target bit length )
- ***blen** : Number* ( 0 < x )

`getInt( t0, blen )` *: Number*
- ***t0** : Number* ( 0 <= x < target bit length )
- ***blen** : Number* ( 0 < x )

`setBitArray( source, t0, blen, s0 )` *: BinaryAsArray*
- ***source** : BinaryAsArray | Int8Array | Uint8Aray | Uint8ClampedArray*
- ***t0** : Number* ( 0 <= x < target bit length )
- ***blen** : Number* ( 0 < x )
- ***s0** : Number* ( 0 <= x < source.bitLength ) ; default value: `0`

`getBitArray( s0, blen )` *: BinaryAsArray*
- ***s0** : Number* ( 0 <= x < source bit length )
- ***blen** : Number* ( 0 < x )