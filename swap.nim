import osproc

let cmdString = "npx hardhat balance --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

let (output, errC) = osproc.execCmdEx(cmdString)

echo output
