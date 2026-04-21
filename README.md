# Dat.js

Dat.js is a lightweight Deno library written in TypeScript designed to build `.dat` files or Node.js binary buffers. It allows you to create structured data records with both fixed and variable lengths, making it easy to integrate with legacy systems or byte-oriented formats.

## Features

- **Fixed-length Records**: Generate records that are automatically padded with spaces to match a fixed length. Characters exceeding the limit will be truncated.
- **Variable-length Records**: Generate records prefixed by a 4-byte (UInt32 Big-Endian) integer indicating their length.
- **File Writing**: Export these records directly into a `.dat` file.
- **Raw Buffers**: Output raw `Buffer` objects in memory for network transmission or custom handling.
- **Custom Encoding**: Support for multiple encodings such as `utf8`, `latin1`, `ascii`, etc.

## Installation / Setup

Ensure you have [Deno](https://deno.land/) installed. The project relies on Deno's built-in support for some Node.js APIs (`node:fs`, `node:buffer`).

## Usage

You can import the module either via `main.ts` or your preferred setup.

### Writing to a file using `Datjs`

The `Datjs` class provides straightforward methods for saving out your data models directly to `.dat` files.

```typescript
import { Datjs } from "./main.ts";

// Writing fixed-sized records
const successFixed = await Datjs.buildFixedSizedDatFile([
    { size: 20, value: "Hello" }, // Padded to 20 bytes
    { size: 20, value: "World" }
], "./fixed-output.dat", { encoding: "utf8" });

console.log(successFixed ? "Fixed file written!" : "Error writing file");

// Writing variable-length records
const successVarLength = await Datjs.buildVarLengthDatFile([
    { value: "Shorter string" },
    { value: "A much longer string here" }
], "./var-output.dat", { encoding: "utf8" });
```

### Building Raw Buffers

If you just need the memory `Buffer` directly without file I/O:

```typescript
import { buildFixedSizedBuffer, buildVarLengthBuffer } from "./main.ts";

const fixedBuffer = buildFixedSizedBuffer([
    { size: 100, value: "Sample fixed string" }
], { encoding: "latin1" });

const varBuffer = buildVarLengthBuffer([
    { value: "Sample variable string" }
], { encoding: "base64url" });
```

## API Types

The library relies on these primary interfaces:

```typescript
import { EncodingOption } from "node:fs";

// For fixed-size records
export interface IDatEntryFixed {
    value: string,
    size: number
}

// For variable-length records
export interface IDatEntryVarLength {
    value: string
}

// Optional configurations passed into the builders
export interface DatOptions {
    encoding: EncodingOption
}
```
