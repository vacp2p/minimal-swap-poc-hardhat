// Example code to test EIP712 library

const hre = require("hardhat");
const eip712 = require("ethers-eip712");

async function main() {
    const typedData = {
        types: {
            EIP712Domain: [
                {name: "name", type: "string"},
                {name: "version", type: "string"},
                {name: "chainId", type: "uint256"},
                {name: "verifyingContract", type: "address"},
            ],
            Person: [
                {name: "name", type: "string"},
                {name: "wallet", type: "address"},
            ]
        },
        // Unexpected identifier
        //primaryType: 'Person' as const,
        primaryType: 'Person',
        domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        message: {
            'name': 'Bob',
            'wallet': '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        }
    }

    const digest = eip712.TypedDataUtils.encodeDigest(typedData)
    const digestHex = ethers.utils.hexlify(digest)

    const wallet = ethers.Wallet.createRandom()
    console.log("Wallet:", wallet);

    const signature = await wallet.signMessage(digest)
    console.log("Signature:", signature);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
