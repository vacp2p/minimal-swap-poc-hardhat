require("@nomiclabs/hardhat-web3");

require("@nomiclabs/hardhat-waffle");

let swap = require("./src/swap-helpers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async taskArgs => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    var bal = web3.utils.fromWei(balance, "ether");
    var resp = {"balance": bal}; // In ETH
    console.log(JSON.stringify(resp));
  });

task("setupSwap", "Setup Swap")
  .setAction(async taskArgs => {
    var resp = await swap.setupSwap();
    console.log(JSON.stringify(resp));
  });

task("signCheque", "Sign cheque")
  .addParam("swapaddress", "Address to Swap Contract (Assumed to belong to Alice)")
  .setAction(async taskArgs => {
    var resp = await swap.signCheque(taskArgs.swapaddress);
    console.log(JSON.stringify(resp));
  });

task("redeemCheque", "Redeem cheque")
  .addParam("swapaddress", "Address to Swap Contract (Assumed to belong to Alice)")
  .addParam("signature", "Cheque signature that can be redeemed")
  .setAction(async taskArgs => {
    var resp = await swap.redeemCheque(taskArgs.swapaddress, taskArgs.signature);
    console.log(JSON.stringify(resp));
  });

task("getBalances", "Get ERC20 Balances for Alice and Bob")
  .addParam("erc20address", "ERC20 Address")
  .setAction(async taskArgs => {
    var resp = await swap.getBalances(taskArgs.erc20address);
    console.log(JSON.stringify(resp));
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};

