import { createDataItemSigner } from "@permaweb/aoconnect";
import { getPendingTasks, reportResult } from "pado-ao-sdk/processes/tasks";
import { getDataById } from "pado-ao-sdk/processes/dataregistry";
import { reencrypt } from "pado-ao-sdk/algorithm";
import { readFileSync } from "node:fs";
import { exit } from "node:process";


/**
 * 
 * Do task
 * 
 * 1. fetch pending task(s)
 * 2. do reencrypt
 * 3. submit result
 * 
 * @param name - the node name
 * @param sk - the node secert key
 */
async function doTask(name: string, sk: string, signer: any) {
    /// 1. fetch pending task(s)
    const pendingTasks = await getPendingTasks();
    const pendingTasksObj = JSON.parse(pendingTasks);
    // console.log("doTask pendingTasks=", pendingTasks);
    for (var i in pendingTasksObj) {
        var task = pendingTasksObj[i];
        // console.log("doTask task=", task);

        const taskId = task["id"];
        console.log("doTask taskId=", taskId);

        var inputData = task["inputData"]
        var inputDataObj = JSON.parse(inputData);
        // console.log("doTask inputData=", inputData);

        var dataId = inputDataObj["dataId"];
        console.log("doTask inputData.dataId=", dataId);


        const dataRes = await getDataById(dataId);
        const dataResObj = JSON.parse(dataRes);
        // console.log("doTask Data=", dataResObj);
        {
            // todo!
            var encSks = dataResObj["encSks"];
            const encSksObj = JSON.parse(encSks);
            let encSk = encSksObj[0];
            if (name == "testnode2") {
                encSk = encSksObj[1];
            } else if (name == "testnode3") {
                encSk = encSksObj[2];
            }

            /// 2. do reencrypt
            var threshold = { t: inputDataObj["t"], n: inputDataObj["n"], indices: inputDataObj["indices"] };
            const enc_sk = encSk;
            const node_sk = sk;
            const consumer_pk = inputDataObj["consumerPk"];
            const reencsksObj = reencrypt(enc_sk, node_sk, consumer_pk, threshold);
            console.log("reencrypt res=", reencsksObj);
            var reencsks = JSON.stringify(reencsksObj);

            /// 3. submit result
            const res = await reportResult(taskId, reencsks, signer);
            console.log("reportResult res=", res);
        }
    }

}

const args = process.argv.slice(2)
if (args.length < 3) {
    console.log("args: <name> <keyfile> <walletpath>");
    exit(2);
}
let name = args[0];
let keyfile = args[1];
let walletpath = args[2];

const key = JSON.parse(readFileSync(keyfile).toString());
const wallet = JSON.parse(readFileSync(walletpath).toString());
const signer = createDataItemSigner(wallet);

async function test() {
    setTimeout(async () => {
        await doTask(name, key.sk, signer);
        test();
    }, 3000)
}
test();



