# pwd example
import osproc

let (output, errC) = osproc.execCmdEx("pwd")

echo output
