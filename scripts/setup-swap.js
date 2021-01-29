const hre = require("hardhat");

async function main() {
    // Deploy ERC20 Token
    // XXX Who is default signer here?
    const ERC20 = await hre.ethers.getContractFactory("ERC20PresetMinterPauser");
    var erc20 = await ERC20.deploy("TestToken", "TEST");
    await erc20.deployed();
    console.log("ERC20: ", erc20.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
