import { EncodingOption } from "node:fs";

/**
 * Supported data types for Dat entries.
 * - `string`: Standard text.
 * - `double`: 64-bit floating point number.
 * - `int`: Signed integer.
 * - `date`: A Javascript Date string, written as an epoch timestamp.
 * - `vb6date`: A Javascript Date string, written as a VB6 OADate (days since 1899-12-30).
 */
export type DatDataTypes = "string" | "double" | "int" | "date" | "vb6date";

/**
 * Represents a fixed-length entry for binary records.
 */
export interface IDatEntryFixed {
    /** The string value to be written. */
    value: string,
    /** The exact byte size to be allocated for this value. The string is padded or truncated to match this size. */
    size: number,
    /** The data type used to determine how to encode the value in the buffer. */
    type: DatDataTypes
}

/**
 * Represents a variable-length entry for binary records.
 */
export interface IDatEntryVarLength {
    /** The string value to be written. */
    value: string,
    /** The data type used to determine how to encode the value in the buffer. */
    type: DatDataTypes
}

/**
 * Endianness kind
 */
export type Endianness = "LE" | "BE";

/**
 * Configuration options for buffer and file generation.
 */
export interface DatOptions {
    /** The character encoding applied to strings. Defaults generally to "utf-8" or "utf8". */
    encoding: EncodingOption,
    /** The byte order (Little-Endian or Big-Endian) used when writing numeric types. */
    endianness: Endianness

}