// Example code to test EIP712 library

const hre = require("hardhat");
const eip712 = require("ethers-eip712");

// All properties on a domain are optional
const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

// The named list of all type definitions
const types = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
    ]
};

// The data to sign
const value = {
    from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
};

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

    // Deterministically create test wallets
    // These are signers that also allow for EIP712 experimental usage
    var alicePrivateKey = "0x5d9ea1ebfd2b79050f8e2e1a872b7395b110140ff576be442639df6625652bfa";
    var bobPrivateKey = "0x7b66f4e902540ad3fb3c69a0a78ca9095a2457c4604e2b2855e386d653228e36";
    var aliceWallet = new ethers.Wallet(alicePrivateKey, ethers.provider);
    var bobWallet = new ethers.Wallet(bobPrivateKey, ethers.provider);

    //var wallet = ethers.Wallet.createRandom()
    console.log("Wallet:", aliceWallet);

    //const signature = await wallet.signMessage(digest)
    //var signature = await wallet._signTypedData(digest);
//    var signers = await ethers.getSigners();
//    var signer = await ethers.provider.getSigner(0);
    //var aliceSigner = signers[0];
    var signature = await aliceWallet._signTypedData(domain, types, value);
    console.log("Signature:", signature);
    // Verify

// Here at the moment
// https://github.com/nomiclabs/hardhat/pull/1189/files

    // TODO Try with random wallet and see how this works
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
