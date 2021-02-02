# Minimal Swap PoC

A minimal end to end proof of concept of using Swap contracts written by Swarm and maintained here: https://github.com/ethersphere/swap-swear-and-swindle

All contract code imported from the above repo.

Ported to Hardhat and Ethers.io.


# How to run

For scripts there is a script to setup SWAP contracts. To run it and make it persistent we can do the following:

``` sh
# Run a node
npx hardhat node

# Run script to setup SWAP contracts
npx hardhat run scripts/setup-swap.js
```

Which will return you a list a list of addresses for ERC20, Alice, Bob, and their respective SWAP contracts.
