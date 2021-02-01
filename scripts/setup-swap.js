const hre = require("hardhat");

async function main() {
    // Deploy ERC20 Token
    var signers = await ethers.getSigners();
    var firstAddress = signers[0].address;

    var DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT = ethers.BigNumber.from(86400)

    const ERC20 = await hre.ethers.getContractFactory("ERC20PresetMinterPauser");
    var erc20 = await ERC20.deploy("TestToken", "TEST");
    await erc20.deployed();
    console.log("ERC20: ", erc20.address);

    // Deploy SwapFactory
    const SimpleSwapFactory = await hre.ethers.getContractFactory("SimpleSwapFactory");
    var simpleSwapFactory = await SimpleSwapFactory.deploy(erc20.address);
    await simpleSwapFactory.deployed();
    console.log("SimpleSwapFactory: ", simpleSwapFactory.address);

    // Deploy Swap
    var resp = await simpleSwapFactory.deploySimpleSwap(firstAddress, DEFAULT_HARDDEPOSIT_DECREASE_TIMEOUT)
    console.log("deploySimpleSwap resp:", resp)

    // Get contract interface to parse logs
    var logs = await ethers.provider.getLogs({address: simpleSwapFactory.address});
    var swapFactoryArtifact = await artifacts.readArtifact("SimpleSwapFactory");
    var swapFactoryInterface = new ethers.utils.Interface(swapFactoryArtifact.abi);
    var ERC20SimpleSwapAddress = swapFactoryInterface.parseLog(logs[0]).args.contractAddress
    console.log("ERC20SimpleSwapAddress ", ERC20SimpleSwapAddress)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
