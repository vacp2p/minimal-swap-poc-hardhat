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
// TODO Parameterize
var erc20address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
//var aliceSwapAddress = "0x94099942864EA81cCF197E9D71ac53310b1468D8";

async function setupSwap() {
    // Basic setup and definitions
    var signers = await ethers.getSigners();
    var aliceSigner = signers[0];
    var bobSigner = signers[0];
    var aliceAddress = signers[0].address;
    var bobAddress = signers[1].address;
    var DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT = ethers.BigNumber.from(86400)

    // Deploy ERC20 Token
    const ERC20 = await hre.ethers.getContractFactory("ERC20PresetMinterPauser");
    var erc20 = await ERC20.deploy("TestToken", "TEST");
    await erc20.deployed();

    // Deploy SwapFactory
    const SimpleSwapFactory = await hre.ethers.getContractFactory("SimpleSwapFactory");
    var simpleSwapFactory = await SimpleSwapFactory.deploy(erc20.address);
    await simpleSwapFactory.deployed();

    // Setup Swap contract interface to parse logs
    var swapFactoryArtifact = await artifacts.readArtifact("SimpleSwapFactory");
    var swapFactoryInterface = new ethers.utils.Interface(swapFactoryArtifact.abi);

    // Deploy Alice Swap and get address
    var resp = await simpleSwapFactory.deploySimpleSwap(aliceAddress, DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT)
    var logs = await ethers.provider.getLogs({address: simpleSwapFactory.address});
    var aliceSwapAddress = swapFactoryInterface.parseLog(logs[0]).args.contractAddress;

    // Deploy Bob Swap and get address
    var resp = await simpleSwapFactory.deploySimpleSwap(bobAddress, DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT)
    var logs = await ethers.provider.getLogs({address: simpleSwapFactory.address});
    var bobSwapAddress = swapFactoryInterface.parseLog(logs[0]).args.contractAddress;

    // Mint ERC20 tokens
    // Alice is default account so issuer, which means she can mint tokens
    // XXX Difference with getContractFactory above?
    var erc20artifact = await artifacts.readArtifact("ERC20PresetMinterPauser");
    var erc20contract = new ethers.Contract(erc20.address, erc20artifact.abi, aliceSigner);
    await erc20contract.mint(aliceAddress, 10000);
    await erc20contract.mint(bobAddress, 10000);

    // Get ERC20 Balance
    var aliceBalance = (await erc20contract.balanceOf(aliceAddress)).toNumber();
    var bobBalance = (await erc20contract.balanceOf(bobAddress)).toNumber();

    // Transfer money to Alice Swap address
    await erc20contract.transfer(aliceSwapAddress, 5000);
    var aliceSwapBalance = (await erc20contract.balanceOf(aliceSwapAddress)).toNumber();

    // Print stuff
    // console.log("ERC20:", erc20.address);
    // console.log("SimpleSwapFactory:", simpleSwapFactory.address);
    // console.log("Alice address:", aliceAddress);
    // console.log("Bob address:", bobAddress);
    // console.log("AliceSwapAddress:", aliceSwapAddress)
    // console.log("BobSwapAddress:", bobSwapAddress)
    // console.log("Alice ERC20 balance:", aliceBalance);
    // console.log("Bob ERC20 balance:", bobBalance);
    // console.log("Alice Swap balance:", aliceSwapBalance);

    var resp = {
        erc20: erc20.address,
        aliceAddress: aliceAddress,
        bobAddress: bobAddress,
        aliceSwapAddress: aliceSwapAddress,
        bobSwapAddress: bobSwapAddress
    };

    return resp;
}

async function signCheque(swapAddress) {
    var aliceSwapAddress = swapAddress;
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

    //console.log("Cheque", cheque);

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

    //console.log("Signer:", aliceSigner.address);
    //console.log("Signature:", signature);

    return {signer: aliceSigner.adress, signature: signature};
}

async function redeemCheque(aliceSwapAddress, issuerSig) {
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

    return {resp: foo}

};

module.exports.setupSwap = setupSwap;
module.exports.signCheque = signCheque;
module.exports.redeemCheque = redeemCheque;
