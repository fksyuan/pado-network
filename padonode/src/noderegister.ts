import { createDataItemSigner } from "@permaweb/aoconnect";
import { register } from "pado-ao-sdk/processes/noderegistry";
import { readFileSync } from "node:fs";
import { exit } from "node:process";


/**
 * 
 * Register node public key
 * 
 * @param name - the node name
 * @param pk - the node public key
 */
async function registerPublicKey(name: string, pk: string, signer: any) {
    return await register(name, pk, `the desc of ${name}`, signer);
}

async function main() {
    setTimeout(async () => {
        const args = process.argv.slice(2)
        if (args.length < 3) {
            console.log("args: <keyfile> <walletpath> <name>");
            exit(2);
        }
        let keyfile = args[0];
        let walletpath = args[1];
        let name = args[2];

        const key = JSON.parse(readFileSync(keyfile).toString());
        const wallet = JSON.parse(readFileSync(walletpath).toString());
        const signer = createDataItemSigner(wallet);

        try {
            const res = await registerPublicKey(name, key.pk, signer);
            console.log(`res=${res}`);
        } catch (e) {
            console.log("registerPublicKey exception:", e);
        }
    }, 1000)
}
main();
