# Minimal Swap PoC

A minimal end to end proof of concept of using Swap contracts written by Swarm and maintained here: https://github.com/ethersphere/swap-swear-and-swindle

All contract code imported from the above repo.

Ported to Hardhat and Ethers.io.


# How to run

For scripts there is a script to setup SWAP contracts. To run it and make it persistent we can do the following:

``` sh
# Run a node
npx hardhat node

# Run script to setup SWAP contracts on local hardhat node
npx hardhat run scripts/setup-swap.js --network localhost
```

Which will return you a list a list of addresses for ERC20, Alice, Bob, and their respective SWAP contracts. You can then interact with it by running a console:

``` sh
npx hardhat console --network localhost
```

After setting up basic SWAP contracts, we can issue and redeem a cheque.

TODO: Turn copy-pasting into CLI arguments or automate it

1. Copy paste the aliceSwapAddress into `sign-cheque.js` script. Then run:

``` sh
npx hardhat run scripts/sign-cheque.js --network localhost
```

2. Copy paste resulting signature and aliceSwapAddress into `redeem-cheque.js`, and run:

``` sh
npx hardhat run scripts/redeem-cheque.js --network localhost
```

Now Alice has send a cheque to Bob, and Bob has received it from the Swap contract. Cheques can be sent and received off-chain, and only settled once Bob wants to.
