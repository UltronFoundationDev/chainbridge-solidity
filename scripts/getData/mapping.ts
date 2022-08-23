import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import * as Helpers from '../../hardhat-test/helpers';

const provider = new ethers.providers.JsonRpcProvider("https://ultron-dev.io");

async function getStructSlot(key: BigNumber, storageSlot: BigNumber) {
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

    return newKey;
}

async function getWithdrawStruct(daoAddress: string, storageSlot: BigNumber) {  
    const dao = await ethers.getContractAt("DAO", daoAddress);

    const withdrawCounter = await dao.getWithdrawRequestCount();

    for(let i:number = 0; i < withdrawCounter; i++) {
        const key = BigNumber.from(i + 1);

        const newKey = await getStructSlot(key, storageSlot)

        const structSlot0 = BigNumber.from(newKey);
        const handlerAddress = BigNumber.from(await provider.getStorageAt(daoAddress, structSlot0));
        console.log("handlerAddress:", handlerAddress.toHexString());

        const structSlot1 = BigNumber.from(newKey).add(1);
        const bytesKey = ethers.utils.keccak256(structSlot1.toHexString());

        const tokenAdderess = BigNumber.from(await provider.getStorageAt(daoAddress, bytesKey));
        console.log("tokenAdderess:", tokenAdderess.toHexString());
        const recepientAddress = BigNumber.from(await provider.getStorageAt(daoAddress, BigNumber.from(bytesKey).add(1).toHexString()));
        console.log("recepientAddress:", recepientAddress.toHexString());
        const amount = BigNumber.from(await provider.getStorageAt(daoAddress, BigNumber.from(bytesKey).add(2).toHexString()));
        console.log("amount:", amount.toHexString());

        const structSlot2 = BigNumber.from(newKey).add(2);
        const status = BigNumber.from(await provider.getStorageAt(daoAddress, structSlot2));
        console.log("status:", status.toHexString(), "\n");
    }
}

async function main() {
    const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
    const storageSlot: BigNumber = BigNumber.from(40);

    await getWithdrawStruct(daoAddress, storageSlot);
}

main()
    .then(_ => console.log('Finished successfully'))
    .catch(console.error)