import { PathLike } from "node:fs";
import { DatOptions, IDatEntryFixed, IDatEntryVarLength } from "@/types.ts";
import { writeFile } from "node:fs/promises";
import { buildFixedSizedBuffer, buildVarLengthBuffer } from "@/src/utils/utils.ts";


/**
 * Core utility class for generating `.dat` format data files directly to the filesystem.
 */
export class Datjs {
    /**
     * Builds and writes a `.dat` file containing fixed-size strings directly to disk.
     * 
     * @param entries - An array of entries specifying their string contents and fixed allocations.
     * @param path - The filesystem path where the `.dat` file will be saved.
     * @param options - Configuration option for the text encoding (defaults to "utf-8").
     * @returns A Promise resolving to true if file writing succeeded, or false if an error occurred.
     */
    static async buildFixedSizedDatFile(entries: IDatEntryFixed[], path: PathLike, options: DatOptions = { encoding: "utf-8", endianness: "LE" }): Promise<boolean> {
        try {
            const datBuffer = buildFixedSizedBuffer(entries, options);
            await writeFile(path, datBuffer);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Builds and writes a `.dat` file containing variable-length strings prefixed by their byte-length directly to disk.
     * 
     * @param entries - An array of entries specifying their string contents.
     * @param path - The filesystem path where the `.dat` file will be saved.
     * @param options - Configuration option for the text encoding (defaults to "utf-8").
     * @returns A Promise resolving to true if file writing succeeded, or false if an error occurred.
     */
    static async buildVarLengthDatFile(entries: IDatEntryVarLength[], path: PathLike, options: DatOptions = { encoding: "utf-8", endianness: "LE" }): Promise<boolean> {
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