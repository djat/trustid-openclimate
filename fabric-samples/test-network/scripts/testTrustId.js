
const { Gateway, Wallets } = require('fabric-network');

var id = require("./trustid-sdk/dist/index.js")
var fs = require("fs")
var wal = id.Wallet.Instance;
var ks = new id.FileKeystore("file", "./keystore");
wal.setKeystore(ks)
wal.generateDID("RSA").then(result => {})
var ccp = JSON.parse(fs.readFileSync("./connection-profile.json", 'utf8'));

var config = {
    stateStore: '/tmp/statestore',
    caName: 'ca-org1',
    mspId: 'org1MSP',
    caURL: "localhost",
    walletID: 'admin',
    asLocalhost: true,
    ccp: ccp,
    chaincodeName: "trustid_1.0",
    fcn: "proxy",
    channel: "mychannel"
}



var trustID = new id.TrustIdHf(config);



wal.addNetwork("hf", trustID);

wal.networks["hf"].configureDriver().then(() => {

    // Use the wallet and the driver
    wal.generateDID("RSA", "test", "test").then(did => {
        let access = { policy: id.PolicyType.PublicPolicy };
        did.unlockAccount("test").then(() => {
            //console.log('ACCOUNT UNLOCKED: '+did)
            wal.networks.hf.createSelfIdentity(did).then(res => {
                console.log('Created test self identity: '+JSON.stringify(res));
                
                /*
                   wal.networks.hf.createService(did, "did:vtn:corentrack2", config.chaincodeName, access, config.channel).then(() => {

                   
                }
                */
                /*wal.networks.hf.subscribeEventService(did, "coren-trackscc", "track-event").then(listener => {
                    console.log("Listening to events...")
                    listener.on("track-event",
                        (returnedEvent) => {
                            console.log(returnedEvent)
                        })
                })
                */

            }).catch(err => {
                    console.log('Error: '+JSON.stringify(err));
            });
            //})

        })
    })
})
