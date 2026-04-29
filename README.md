# Dat.js

Dat.js is a lightweight Deno library written in TypeScript designed to build `.dat` files or Node.js binary buffers. It allows you to create structured data records with both fixed and variable lengths, making it easy to integrate with legacy systems or byte-oriented formats.

## Features

- **Fixed-length Records**: Generate records that are automatically padded with spaces to match a fixed length. Characters exceeding the limit will be truncated.
- **Variable-length Records**: Generate records prefixed by a 4-byte (UInt32 Big-Endian) integer indicating their length.
- **Data Types**: Support for multiple data types including `string`, `double`, `int`, `date` (Unix timestamp), and `vb6date` (VB6 OADate) for seamless legacy system integration.
- **File Writing**: Export these records directly into a `.dat` file.
- **Raw Buffers**: Output raw `Buffer` objects in memory for network transmission or custom handling.
- **Custom Encoding & Endianness**: Support for multiple encodings such as `utf8`, `latin1`, `ascii`, etc., and configurable byte order (`LE` or `BE`) for numeric types.

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
    { size: 20, value: "Hello", type: "string" }, // Padded to 20 bytes
    { size: 8, value: "1234.56", type: "double" }, // 64-bit float
    { size: 8, value: "2026-04-29", type: "vb6date" } // VB6 compatible date
], "./fixed-output.dat", { encoding: "utf8", endianness: "LE" });

console.log(successFixed ? "Fixed file written!" : "Error writing file");

// Writing variable-length records
const successVarLength = await Datjs.buildVarLengthDatFile([
    { value: "Shorter string", type: "string" },
    { value: "42", type: "int" }
], "./var-output.dat", { encoding: "utf8", endianness: "BE" });
```

### Building Raw Buffers

If you just need the memory `Buffer` directly without file I/O:

```typescript
import { buildFixedSizedBuffer, buildVarLengthBuffer } from "./main.ts";

const fixedBuffer = buildFixedSizedBuffer([
    { size: 100, value: "Sample fixed string", type: "string" }
], { encoding: "latin1", endianness: "LE" });

const varBuffer = buildVarLengthBuffer([
    { value: "Sample variable string", type: "string" }
], { encoding: "base64url", endianness: "BE" });
```

## API Types

The library relies on these primary interfaces:

```typescript
import { EncodingOption } from "node:fs";

export type DatDataTypes = "string" | "double" | "int" | "date" | "vb6date";

// For fixed-size records
export interface IDatEntryFixed {
    value: string,
    size: number,
    type: DatDataTypes
}

// For variable-length records
export interface IDatEntryVarLength {
    value: string,
    type: DatDataTypes
}

export type Endianness = "LE" | "BE";

// Optional configurations passed into the builders
export interface DatOptions {
    encoding: EncodingOption,
    endianness: Endianness
}
```
