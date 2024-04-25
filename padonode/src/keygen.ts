import { exit } from "node:process";
import { keygen } from "pado-ao-sdk/algorithm";
import { writeFileSync } from "node:fs";

/**
 * Generate key pair, store to <name>-key.json
 *
 * @param name - the node name
 */
function generateKey(name: string) {
    let key = keygen();
    writeFileSync(`${name}-key.json`, JSON.stringify(key));
}

async function test() {
    setTimeout(() => {
        const args = process.argv.slice(2)
        if (args.length < 1) {
            console.log("args: <name>");
            exit(2);
        }
        let name = args[0];

        generateKey(name);
    }, 1000);
}
test();
