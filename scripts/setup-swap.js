const hre = require("hardhat");

async function main() {
    var signers = await ethers.getSigners();
    var aliceAddress = signers[0].address;
    var bobAddress = signers[1].address;

    var DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT = ethers.BigNumber.from(86400)

    // Deploy ERC20 Token
    const ERC20 = await hre.ethers.getContractFactory("ERC20PresetMinterPauser");
    var erc20 = await ERC20.deploy("TestToken", "TEST");
    await erc20.deployed();
    console.log("ERC20:", erc20.address);

    // Deploy SwapFactory
    const SimpleSwapFactory = await hre.ethers.getContractFactory("SimpleSwapFactory");
    var simpleSwapFactory = await SimpleSwapFactory.deploy(erc20.address);
    await simpleSwapFactory.deployed();
    console.log("SimpleSwapFactory:", simpleSwapFactory.address);

    // Setup Swap contract interface to parse logs
    var swapFactoryArtifact = await artifacts.readArtifact("SimpleSwapFactory");
    var swapFactoryInterface = new ethers.utils.Interface(swapFactoryArtifact.abi);

    // Deploy Alice Swap and get address
    var resp = await simpleSwapFactory.deploySimpleSwap(aliceAddress, DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT)
    var logs = await ethers.provider.getLogs({address: simpleSwapFactory.address});
    var AliceSwapAddress = swapFactoryInterface.parseLog(logs[0]).args.contractAddress

    // Deploy Bob Swap and get address
    var resp = await simpleSwapFactory.deploySimpleSwap(bobAddress, DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT)
    var logs = await ethers.provider.getLogs({address: simpleSwapFactory.address});
    var BobSwapAddress = swapFactoryInterface.parseLog(logs[0]).args.contractAddress

    console.log("Alice address:", aliceAddress);
    console.log("Bob address:", bobAddress);
    console.log("AliceSwapAddress:", AliceSwapAddress)
    console.log("BobSwapAddress:", BobSwapAddress)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
