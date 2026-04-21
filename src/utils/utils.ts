import { Buffer } from "node:buffer";
import { DatOptions, IDatEntryFixed, IDatEntryVarLength } from "@/types.ts";

/**
 * Builds a single Buffer containing fixed-length records.
 * Each entry is padded with spaces to the right if shorter than its configured size,
 * or truncated if it exceeds the configured size.
 *
 * @param entries - Array of fixed-size data entries.
 * @param options - Encoding options (defaults to "utf8").
 * @returns A concatenated Buffer of all fixed-size entries.
 */
export function buildFixedSizedBuffer(entries: IDatEntryFixed[], options: DatOptions = { encoding: "utf8" }): Buffer {
    const { encoding } = options;
    const buffers = entries.map((entry) => {
        const value = entry.value;
        if (value.length > entry.size) return Buffer.from(value.substring(0, entry.size), encoding);
        return Buffer.from(value.padEnd(entry.size, ' '));
    });
    return Buffer.concat(buffers);
}

/**
 * Builds a single Buffer containing variable-length records.
 * Each entry is immediately preceded by a 4-byte (32-bit Big-Endian unsigned integer) representing its length.
 *
 * @param entries - Array of variable-length data entries.
 * @param options - Encoding options (defaults to "utf8").
 * @returns A concatenated Buffer of all records including their size prefixes.
 */
export function buildVarLengthBuffer(entries: IDatEntryVarLength[], options: DatOptions = { encoding: "utf8" }): Buffer {
    const { encoding } = options;
    const buffers: Buffer[] = [];
    entries.forEach((entry) => {
        const value = Buffer.from(entry.value, encoding);
        const length = value.length;

        const lengthPrefix = Buffer.alloc(4);
        lengthPrefix.writeUInt32BE(length);

        buffers.push(lengthPrefix);
        buffers.push(value);
    });

    return Buffer.concat(buffers);
}

console.log(buildFixedSizedBuffer([{ size: 100, value: "La cocina rota de mama" }], { encoding: "latin1" }).toString("latin1"));
console.log(buildVarLengthBuffer([{ value: "Hola como estas loca" }], {encoding: "base64url"}).toString("base64url"));