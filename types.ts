import { EncodingOption } from "node:fs";

export type DatDataTypes = "string" | "double" | "int" | "date" | "vb6date";

/**
 * Represents a fixed-length entry for binary records.
 */
export interface IDatEntryFixed {
    /** The string value to be written. */
    value: string,
    /** The exact byte size to be allocated for this value. The string is padded or truncated to match this size. */
    size: number,
    /** */
    type: DatDataTypes
}

/**
 * Represents a variable-length entry for binary records.
 */
export interface IDatEntryVarLength {
    /** The string value to be written. */
    value: string
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
    endianness: Endianness

}