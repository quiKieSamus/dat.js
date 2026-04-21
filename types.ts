import { EncodingOption } from "node:fs";

export interface IDatEntryFixed {
    value: string,
    size: number
}

export interface IDatEntryVarLength {
    value: string
}

export interface DatOptions {
    encoding: EncodingOption
}