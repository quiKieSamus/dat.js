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
export function buildFixedSizedBuffer(entries: IDatEntryFixed[], options: DatOptions = { encoding: "utf8", endianness: "LE" }): Buffer {
    const { encoding, endianness } = options;
    const buffers = entries.map((entry) => {
        const { value, type, size } = entry;

        if (type === "int") {
            const buf = Buffer.alloc(size);
            const num = Number(value);
            if (size === 8) {
                if (endianness === "BE") buf.writeBigInt64BE(BigInt(num), 0);
                else buf.writeBigInt64LE(BigInt(num), 0);
            } else {
                if (endianness === "BE") buf.writeIntBE(num, 0, size);
                else buf.writeIntLE(num, 0, size);
            }
            return buf;
        }

        if (type === "double") {
            const buf = Buffer.alloc(size);
            const num = Number(value);
            if (size === 4) {
                if (endianness === "BE") buf.writeFloatBE(num, 0);
                else buf.writeFloatLE(num, 0);
            } else {
                if (endianness === "BE") buf.writeDoubleBE(num, 0);
                else buf.writeDoubleLE(num, 0);
            }
            return buf;
        }

        if (type === "date") {
            const buf = Buffer.alloc(size);
            const time = new Date(value).getTime();
            if (size === 8) {
                if (endianness === "BE") buf.writeBigInt64BE(BigInt(time), 0);
                else buf.writeBigInt64LE(BigInt(time), 0);
            } else {
                if (endianness === "BE") buf.writeIntBE(time, 0, size);
                else buf.writeIntLE(time, 0, size);
            }
            return buf;
        }

        if (type === "vb6date") {
            const buf = Buffer.alloc(8);
            const time = new Date(value).getTime();
            const vb6Epoch = Date.UTC(1899, 11, 30);
            const oaDate = (time - vb6Epoch) / (24 * 60 * 60 * 1000);
            if (endianness === "BE") buf.writeDoubleBE(oaDate, 0);
            else buf.writeDoubleLE(oaDate, 0);
            return buf;
        }

        if (value.length > size) return Buffer.from(value.substring(0, size), encoding);
        return Buffer.from(value.padEnd(size, ' '), encoding);
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
export function buildVarLengthBuffer(entries: IDatEntryVarLength[], options: DatOptions = { encoding: "utf8", endianness: "LE" }): Buffer {
    const { encoding, endianness } = options;
    const buffers: Buffer[] = [];
    entries.forEach((entry) => {
        let valueBuf: Buffer;
        const { value, type } = entry;

        if (type === "int") {
            valueBuf = Buffer.alloc(4);
            if (endianness === "BE") valueBuf.writeInt32BE(Number(value), 0);
            else valueBuf.writeInt32LE(Number(value), 0);
        } else if (type === "double") {
            valueBuf = Buffer.alloc(8);
            if (endianness === "BE") valueBuf.writeDoubleBE(Number(value), 0);
            else valueBuf.writeDoubleLE(Number(value), 0);
        } else if (type === "date") {
            valueBuf = Buffer.alloc(8);
            const time = new Date(value).getTime();
            if (endianness === "BE") valueBuf.writeBigInt64BE(BigInt(time), 0);
            else valueBuf.writeBigInt64LE(BigInt(time), 0);
        } else if (type === "vb6date") {
            valueBuf = Buffer.alloc(8);
            const time = new Date(value).getTime();
            const vb6Epoch = Date.UTC(1899, 11, 30);
            const oaDate = (time - vb6Epoch) / (24 * 60 * 60 * 1000);
            if (endianness === "BE") valueBuf.writeDoubleBE(oaDate, 0);
            else valueBuf.writeDoubleLE(oaDate, 0);
        } else {
            valueBuf = Buffer.from(value, encoding);
        }

        const length = valueBuf.length;
        const lengthPrefix = Buffer.alloc(4);
        lengthPrefix.writeUInt32BE(length, 0);

        buffers.push(lengthPrefix);
        buffers.push(valueBuf);
    });

    return Buffer.concat(buffers);
}
