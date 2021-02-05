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

// Seems to persist, first two default accounts
var aliceAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
var bobAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// XXX These change
var erc20address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
var aliceSwapAddress = "0x94099942864EA81cCF197E9D71ac53310b1468D8";

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

    const types = {
        Cheque: ChequeType
    };

    const domain = {
        name: "Chequebook",
        version: "1.0",
        chainId
    };

    const value = cheque;

    // XXX Workaround to get to private signTypedData interface
    var mnemonic = "test test test test test test test test test test test junk";
    var path0 = "m/44'/60'/0'/0/0";
    var recoveredWallet = ethers.Wallet.fromMnemonic(mnemonic, path0);
    var aliceSignerWallet = recoveredWallet.connect(ethers.provider);

    var signature = await aliceSignerWallet._signTypedData(domain, types, value);
    console.log("Signer:", aliceSigner.address);
    console.log("Signature:", signature);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
