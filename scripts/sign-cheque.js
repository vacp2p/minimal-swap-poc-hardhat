const hre = require("hardhat");
const eip712 = require("ethers-eip712");

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' }
    // Missing
    // {name: "verifyingContract", type: "address"},
]

const ChequeType = [
    { name: 'chequebook', type: 'address' },
    { name: 'beneficiary', type: 'address' },
    { name: 'cumulativePayout', type: 'uint256' }
]

// XXX Hardcoded from recent deploy to Hardhat dev chain
var erc20address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
var aliceAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
var aliceSwapAddress = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
var bobAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// TODO This should be parameterized with arguments, so probably as a task or standalone script?
async function main() {
    var swapAddress = aliceSwapAddress;
    var beneficiary = bobAddress;
    var cumulativePayout = 500;
    var chainId = 31337;

    var signers = await ethers.getSigners();
    var aliceSigner = signers[0];

    const cheque = {
        chequebook: swapAddress,
        beneficiary,
        cumulativePayout: cumulativePayout
    };

    console.log("Cheque", cheque);

    const typedData = {
        types: {
            EIP712Domain,
            Cheque: ChequeType
        },
        domain: {
          name: "Chequebook",
          version: "1.0",
          chainId
        },
        primaryType: 'Cheque',
        message: cheque
    }

    const digest = eip712.TypedDataUtils.encodeDigest(typedData)
    const digestHex = ethers.utils.hexlify(digest)

    // NOTE this may be different from eth_signTypedData_v3, etc
    const signature = await aliceSigner.signMessage(digest)
    console.log("Signature:", signature);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
