import { Buffer } from "node:buffer";
import { DatOptions, IDatEntryFixed, IDatEntryVarLength } from "@/types.ts";

export function buildFixedSizedBuffer(entries: IDatEntryFixed[], options: DatOptions = { encoding: "utf8" }): Buffer {
    const { encoding } = options;
    const buffers = entries.map((entry) => {
        const value = entry.value;
        if (value.length > entry.size) return Buffer.from(value.substring(0, entry.size), encoding);
        return Buffer.from(value.padEnd(entry.size, ' '));
    });
    return Buffer.concat(buffers);
}

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