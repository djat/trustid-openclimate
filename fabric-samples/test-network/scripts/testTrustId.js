
const { Gateway, Wallets } = require('fabric-network');

var sdk = require("../../../trustid-sdk/dist/index.js")
var fs = require("fs")
var wal = sdk.Wallet.Instance;
var ks = new sdk.FileKeystore("file", "./keystore");
wal.setKeystore(ks)
wal.generateDID("RSA").then(result => {})
var ccp = JSON.parse(fs.readFileSync("./connection-profile.json", 'utf8'));

var config = {
    stateStore: '/Users/robinklemens/Documents/GitHub/ca2sig/trustid-openclimate/fabric-samples/test-network/scripts/wallet',
    caName: 'ca-org1',
    caAdmin: 'admin',
    caPassword: 'adminpw',
    tlsOptions: {
        trustedRoots: "-----BEGIN CERTIFICATE-----\nMIICFzCCAb2gAwIBAgIUScOQL2q9Yif/A4QjHHZQ75LnHQwwCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTIwMTEyMDEzMjUwMFoXDTM1MTExNzEzMjUwMFowaDELMAkG\nA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQKEwtIeXBl\ncmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMtY2Etc2Vy\ndmVyMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEdaHiCdcPqoQ4uOG9gprqVTck\nFOkiNRhZffFkgjTQCTiwDO6PON7FSW/qQWqbukW01t4mViuV+dvgihQ7TauslaNF\nMEMwDgYDVR0PAQH/BAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQEwHQYDVR0OBBYE\nFJbqvKSWlsU3cY8eVggbXh+qdQ56MAoGCCqGSM49BAMCA0gAMEUCIQCS7hPlsnSg\nb6+xIr8H6MPII3zmzvImQwu1HiaKSmYcXgIgQ6JG4+sNBXxGdC5aabZyq9/ngdn/\n9gAddO9qP2TZszM=\n-----END CERTIFICATE-----\n",
        verify: false
    },
    mspId: 'org1MSP',
    caURL: "https://localhost:7054",
    mspId: 'Org1MSP',
    walletID: 'admin',
    asLocalhost: true,
    ccp: ccp,
    chaincodeName: "trustid",
    fcn: "proxy",
    channel: "mychannel"
}

async function configureNetwork() {
    console.log("[*] Configuring network driver...")
    // Create HF driver
    var trustID = new sdk.TrustIdHf(config);
    // Add and configure the network driver in our wallet.
    wal.addNetwork("hf", trustID);
    await wal.networks["hf"].configureDriver()
}

// Create you own DID key pair and register it in the TrustID platform.
async function createDID(){
    // Generate key pair locally.
    const did = await wal.generateDID("RSA", "test", "test")
    console.log("[*] Generated DID: \n", did)
    await did.unlockAccount("test")
    // Register in the platform.
    await wal.networks.hf.createSelfIdentity(did)
    console.log("[*] Self identity registered")
    wal.setDefault(did)
    // Get the registered identity.
    let res = await wal.networks.hf.getIdentity(did, did.id)
    console.log("[*] Get registered identity\n", res)
}

// Interact with a service in the platform (you need to create a service before
// being able to call it).
async function serviceInteraction(){
    const did = await wal.getDID("test2")
    // Get service
    let res = await wal.networks.hf.getService(did, "coren-trackscc-v2")
    console.log("[*] Service info:\n", res)
    // Create an asset in the service
    const asset = {assetId: "test"+Date.now(), data:{"a":1, "b":2}, metadata: {"c": 4}}
    const assetStr = JSON.stringify(asset)
    res = await wal.networks.hf.invoke(did, "coren-trackscc-v2",["createAsset", assetStr], "channel1")
    console.log("[*] Asset creation:\n", res)
    // Get the created asset.
    res = await wal.networks.hf.invoke(did, "coren-trackscc-v2",["getAsset", JSON.stringify({assetId: asset.assetId})], "channel1")
    console.log("[*] Asset registered\n", res)
}

// Use the wallet to make offchain interactions with your DID
async function walletInteraction(){
    const did = await wal.getDID("did:vtn:trustid:90b7fc4de0f28998f05d8bee7c5bce6ac327d69ed5bd381b972b267b593186ef")
    const payload = {hello: "AWESOME PROJECT!!!"}
    await did.unlockAccount("test")
    console.log("[*] Signing payload: \n", payload)
    const sign = await did.sign(payload)
    console.log("[*] DID signature\n", sign)
    let verify = await did.verify(sign, did)
    console.log("[*] Signature verification\n", verify)
    const did2 = await wal.generateDID("RSA", "test", "test")
    verify = await did.verify(sign, did2)
    console.log("[*] Signature wrong verification\n", verify)
}

// Main async function.
async function main() {
    await configureNetwork()
    // await createDID()
    // await serviceInteraction()
    /await walletInteraction()
}

main().then(console.log).catch(console.log)
// tsc getting-started.ts && node getting-started.js
