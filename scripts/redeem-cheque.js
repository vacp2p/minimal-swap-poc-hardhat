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


// XXX Hardcoded return from sign-cheque script of cheque from Alice to Bob:
// Cheque {
//  chequebook: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
//  beneficiary: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
//  cumulativePayout: 500
//}
var issuerSig = "0xa00dfb22e246211c39e594c35eb3321a8aa99c83cb94ea8dcb311a381181c04637676e95e1f51901a6c1f3423852a2431baed00b0cffca5719698055283069dc1c";

// TODO This should be parameterized with arguments, so probably as a task or standalone script?
async function main() {
    var recipient = bobAddress;
    var cumulativePayout = 500;

    var signers = await ethers.getSigners();
    var aliceSigner = signers[0];
    var bobSigner = signers[1];

    var swapArtifact = await artifacts.readArtifact("ERC20SimpleSwap");
    var swapContract = new ethers.Contract(aliceSwapAddress, swapArtifact.abi, bobSigner);

    var foo = await swapContract.cashChequeBeneficiary(recipient, cumulativePayout, issuerSig);
    console.log("Resp", foo);

    // Reproduced error here:
    // ProviderError: VM Exception while processing transaction: revert SimpleSwap: invalid issuer signature
    // TODO Fix it

};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
