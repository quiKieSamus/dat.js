import { PathLike } from "node:fs";
import { DatOptions, IDatEntryFixed, IDatEntryVarLength } from "@/types.ts";
import { writeFile } from "node:fs/promises";
import { buildFixedSizedBuffer, buildVarLengthBuffer } from "@/src/utils/utils.ts";


export class Datjs {
    static async buildFixedSizedDatFile(entries: IDatEntryFixed[], path: PathLike, options: DatOptions = { encoding: "utf-8" }) {
        try {
            const datBuffer = buildFixedSizedBuffer(entries, options);
            await writeFile(path, datBuffer);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    static async buildVarLengthDatFile(entries: IDatEntryVarLength[], path: PathLike, options: DatOptions = { encoding: "utf-8" }) {
        try {
            const datBuffer = buildVarLengthBuffer(entries, options);
            await writeFile(path, datBuffer);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}