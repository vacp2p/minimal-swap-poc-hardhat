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
    console.log("ERC20:", erc20.address);
    console.log("SimpleSwapFactory:", simpleSwapFactory.address);
    console.log("Alice address:", aliceAddress);
    console.log("Bob address:", bobAddress);
    console.log("AliceSwapAddress:", aliceSwapAddress)
    console.log("BobSwapAddress:", bobSwapAddress)
    console.log("Alice ERC20 balance:", aliceBalance);
    console.log("Bob ERC20 balance:", bobBalance);
    // console.log("Alice Swap balance:", aliceSwapBalance);
}

module.exports.setupSwap = setupSwap;
