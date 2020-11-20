# TrustID for OpenClimate
This repo includes artifacts to run TrustID on Fabric for OpenClimate use case exploration


## Steps to setup in environment


cd fabric-samples/test-network<br />

./network.sh down<br />

./network.sh up createChannel -ca<br />

source setenv.sh<br />

./scripts/deployTID.sh<br />

cd scripts<br />

rm -rf wallet<br />
node enrollAdmin.js<br />

###### add ca-tls.pem to testTrustId.js
Open organizations/peerOrganizations/org1.example.com/connection-org1.json and copy byte64 encrypted tlsCACerts pem. Open testTrustId.js and replace `trustedRoots` tlsCACerts pem.

node testTrustId.js<br />



## Next steps (2020/11/20)

###### Test walletInteraction() 
1. Paste did from console output to `const did = await wal.getDID("paste some did here")``
e.g., 
const did = await wal.getDID("did:vtn:trustid:90b7fc4de0f28998f05d8bee7c5bce6ac327d69ed5bd381b972b267b593186ef")
2. Try to get `did.verify` working
current error (2020/11/20)
```shell
(node:52129) UnhandledPromiseRejectionWarning: Error: no key found at processSig (/Users/robinklemens/Documents/GitHub/ca2sig/trustid-openclimate/trustid-sdk/node_modules/node-jose/lib/jws/verify.js:131:22)
```
###### Test serviceInteraction()
1. Create a service ---> First figure out how to start a service
2. 
3. 




## License <a name="license"></a>

Hyperledger Project source code files are made available under the Apache
License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
The files are made available under the Creative
Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
