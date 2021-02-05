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
//var erc20address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
var aliceSwapAddress = "0x94099942864EA81cCF197E9D71ac53310b1468D8";

// XXX Hardcoded return from sign-cheque script of cheque from Alice to Bob:
var issuerSig = "0x67c0c9ec1e72e90ebf0155b10953ec81b1ff5bca6283e51bee9bb55ec2fa14876278e88e8f0a34570bed0f9bed4cec9c576dc0ac34512adddbfd157b5be5df091c";

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
