import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import * as Helpers from '../../hardhat-test/helpers';

function increaseHexBy(hex: string | null, increaseNumber: number) {
    console.log(`sha3 hex = ${hex}`);
    const number = BigNumber.from(hex);
    const sum = number.add(increaseNumber);
    const result = sum.toHexString();
    return result;
   }

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/i2LgfhBeI-JidguSNlFuToo7kPSkFBPb");
    const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
    const dao = await ethers.getContractAt("DAO", daoAddress);

    const key:BigNumber = BigNumber.from(1);
    const storageSlot: BigNumber = BigNumber.from(4);

    // The pre-image used to compute the Storage location
    const newKeyPreimage = ethers.utils.concat([
        // Mappings' keys in Solidity must all be word-aligned (32 bytes)
        ethers.utils.hexZeroPad(key.toHexString(), 32),

        // Similarly with the slot-index into the Solidity variable layout
        ethers.utils.hexZeroPad(storageSlot.toHexString(), 32),
    ]);

    console.log("New Key Preimage:",  ethers.utils.hexlify(newKeyPreimage));
    // "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004"

    const newKey =  ethers.utils.keccak256(newKeyPreimage);
    console.log("New Key:", newKey);
    // "0xabd6e7cb50984ff9c2f3e18a2660c3353dadf4e3291deeb275dae2cd1e44fe05"

    const value = await provider.getStorageAt(daoAddress, newKey);
    console.log("Value:", ethers.utils.hexZeroPad(value, 32));
}

main()
    .then(_ => console.log('Finished successfully'))
    .catch(console.error)