# TrustID for OpenClimate
This repo includes artifacts to run TrustID on Fabric for OpenClimate use case exploration


## Steps to setup in environment


cd fabric-samples/test-network
./network.sh up -ca
./network.sh createChannel
source setenv.sh
./scripts/deployTID.sh
cd scripts
node enrollAdmin.js
node testTrustId.js

Current result 11/19/2020:

2020-11-19T19:15:13.815Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
Error: {"message":"DiscoveryService: mychannel error: access denied","stack":"Error: DiscoveryService: mychannel error: access denied\n    at DiscoveryService.send (/Users/davidthomson/Verses/trustid-openclimate/trustid-sdk/node_modules/fabric-common/lib/DiscoveryService.js:333:11)\n    at process._tickCallback (internal/process/next_tick.js:68:7)"}


## License <a name="license"></a>

Hyperledger Project source code files are made available under the Apache
License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
The files are made available under the Creative
Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
