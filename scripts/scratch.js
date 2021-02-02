// Scratch code, to be pasted into a REPL

var erc20address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
//SimpleSwapFactory: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
var aliceAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
//Bob address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
//AliceSwapAddress: 0x8aCd85898458400f7Db866d53FCFF6f0D49741FF
//BobSwapAddress: 0xe082b26cEf079a095147F35c9647eC97c2401B83

var erc20artifact = await artifacts.readArtifact("ERC20PresetMinterPauser");
var signers = await ethers.getSigners();
var aliceSigner = signers[0];
var erc20contract = new ethers.Contract(erc20address, erc20artifact.abi, aliceSigner);

// Mint ERC20
await erc20contract.mint(aliceAddress, 10000);

var aliceBalance = await erc20contract.balanceOf(aliceAddress);
aliceBalance.toNumber(); // => 1000
