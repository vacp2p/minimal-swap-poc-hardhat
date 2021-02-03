// Scratch code, to be pasted into a REPL

[user@work-dev minimal-swap-poc-hardhat]$ npx hardhat run scripts/setup-swap.js --network localhost
ERC20: 0x5FbDB2315678afecb367f032d93F642f64180aa3
SimpleSwapFactory: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Alice address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Bob address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
AliceSwapAddress: 0xCafac3dD18aC6c6e92c921884f9E4176737C052c
BobSwapAddress: 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e
Alice ERC20 balance: 10000
Bob ERC20 balance: 10000


var erc20address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
var aliceAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
var aliceSwapAddress = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
var bobAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

//SimpleSwapFactory: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
//Bob address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
//BobSwapAddress: 0xe082b26cEf079a095147F35c9647eC97c2401B83

var erc20artifact = await artifacts.readArtifact("ERC20PresetMinterPauser");
var signers = await ethers.getSigners();
var aliceSigner = signers[0];
var erc20contract = new ethers.Contract(erc20address, erc20artifact.abi, aliceSigner);

// Mint ERC20
await erc20contract.mint(aliceAddress, 10000);

var aliceBalance = await erc20contract.balanceOf(aliceAddress);
aliceBalance.toNumber(); // => 1000

// ERC20.transfer()
//  await erc20.transfer(App.aliceSwapAddress, 1000, {from: App.aliceAddress})
var foo = erc20contract.transfer(aliceSwapAddress, 1000);
(await erc20contract.balanceOf(aliceSwapAddress)).toNumber();
