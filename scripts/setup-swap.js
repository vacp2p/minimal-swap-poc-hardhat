const hre = require("hardhat");
let swap = require("../src/setup-swap");

async function main() {
    var resp = await swap.setupSwap();

    console.log("JSON resp");
    console.log(JSON.stringify(resp));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
