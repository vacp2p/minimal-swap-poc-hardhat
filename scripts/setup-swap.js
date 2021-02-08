const hre = require("hardhat");
let swap = require("../src/setup-swap");

async function main() {
    await swap.setupSwap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
