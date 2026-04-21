import { Datjs, buildFixedSizedBuffer, buildVarLengthBuffer } from "./main.ts";
import { Buffer } from "node:buffer";
import { existsSync, readFileSync, unlinkSync } from "node:fs";

console.log("Starting tests for Dat.js...");

// 1. Test Fixed Sized Buffer
console.log("\nTesting buildFixedSizedBuffer...");
const fixedEntries = [
    { size: 10, value: "Hello" },    // Should be padded to 10
    { size: 5, value: "LongString" } // Should be truncated to 5
];
const fixedBuffer = buildFixedSizedBuffer(fixedEntries, { encoding: "utf8" });

const expectedFixed = Buffer.concat([
    Buffer.from("Hello".padEnd(10, ' ')),
    Buffer.from("LongS")
]);

if (fixedBuffer.equals(expectedFixed)) {
    console.log("✅ buildFixedSizedBuffer works correctly!");
} else {
    console.error("❌ buildFixedSizedBuffer failed!");
    console.error("Expected:", expectedFixed.toString());
    console.error("Actual:", fixedBuffer.toString());
}

// 2. Test Var Length Buffer
console.log("\nTesting buildVarLengthBuffer...");
const varEntries = [
    { value: "Hi" },
    { value: "Testing" }
];
const varBuffer = buildVarLengthBuffer(varEntries, { encoding: "utf8" });

// Construct expected manually
const buf1 = Buffer.from("Hi");
const len1 = Buffer.alloc(4);
len1.writeUInt32BE(buf1.length);

const buf2 = Buffer.from("Testing");
const len2 = Buffer.alloc(4);
len2.writeUInt32BE(buf2.length);

const expectedVar = Buffer.concat([len1, buf1, len2, buf2]);

if (varBuffer.equals(expectedVar)) {
    console.log("✅ buildVarLengthBuffer works correctly!");
} else {
    console.error("❌ buildVarLengthBuffer failed!");
}

// 3. Test File Writing
console.log("\nTesting Datjs File Writing...");
const testFilePath = "./test_output.dat";

(async () => {
    try {
        // Test Fixed File
        const successFixed = await Datjs.buildFixedSizedDatFile(fixedEntries, testFilePath);
        if (successFixed && existsSync(testFilePath)) {
            const fileContent = readFileSync(testFilePath);
            if (fileContent.equals(expectedFixed)) {
                console.log("✅ Datjs.buildFixedSizedDatFile wrote correct content!");
            } else {
                console.error("❌ Datjs.buildFixedSizedDatFile content mismatch!");
            }
            unlinkSync(testFilePath);
        } else {
            console.error("❌ Datjs.buildFixedSizedDatFile failed to write file!");
        }

        // Test Var Length File
        const successVar = await Datjs.buildVarLengthDatFile(varEntries, testFilePath);
        if (successVar && existsSync(testFilePath)) {
            const fileContent = readFileSync(testFilePath);
            if (fileContent.equals(expectedVar)) {
                console.log("✅ Datjs.buildVarLengthDatFile wrote correct content!");
            } else {
                console.error("❌ Datjs.buildVarLengthDatFile content mismatch!");
            }
            unlinkSync(testFilePath);
        } else {
            console.error("❌ Datjs.buildVarLengthDatFile failed to write file!");
        }

        console.log("\nAll tests completed!");
    } catch (error) {
        console.error("An error occurred during file tests:", error);
    }
})();
