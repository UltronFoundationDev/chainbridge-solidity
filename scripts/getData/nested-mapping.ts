import { keccak256 } from "ethereumjs-util";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("https://ultron-dev.io");

    const daoAddress = "0xc078626DA5C09DC63A7c5C0c030f431EFfF098b8";
    const dao = await ethers.getContractAt("DAO", daoAddress);

    const key: BigNumber = BigNumber.from(1);
    const key2 = '0x012A1b8F33CEfc233618716ca50Fd670A784Bb51';
    const storageSlot: BigNumber = BigNumber.from(5);
    //const keyValue = (key.add(storageSlot)).toHexString();

    const newKeyPreimage = ethers.utils.concat([
        // Mappings' keys in Solidity must all be word-aligned (32 bytes)
        ethers.utils.hexZeroPad(key.toHexString(), 32),

        // Similarly with the slot-index into the Solidity variable layout
        ethers.utils.hexZeroPad(storageSlot.toHexString(), 32),
    ]);

    console.log("New Key Preimage:",  ethers.utils.hexlify(newKeyPreimage));

    const newKey = ethers.utils.keccak256(newKeyPreimage)

    const newKeyPreimage1 = ethers.utils.concat([
        // Mappings' keys in Solidity must all be word-aligned (32 bytes)
        ethers.utils.hexZeroPad(key2.toString(), 32),

        // Similarly with the slot-index into the Solidity variable layout
        ethers.utils.hexZeroPad(k.toString(), 32),
    ]);

    console.log("New Key Preimage1:",  ethers.utils.hexlify(newKeyPreimage1));

    const newKey1 = ethers.utils.keccak256(newKeyPreimage1)
    console.log("newKey1",  newKey1);

    const res = await provider.getStorageAt(daoAddress, newKey1);
    // keccak256(uint256(9) . keccak256(uint256(4) . uint256(1)))

    console.log(`res = ${res}`);
}

main()
    .then(_ => console.log('Finished successfully'))
    .catch(console.error)