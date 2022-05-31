import { BytesLike } from "ethers";
import { Hexable, ParamType } from "ethers/lib/utils";
import { ethers } from "hardhat";

const AbiCoder = new ethers.utils.AbiCoder;

export const toHex = (covertThis: number | bigint | BytesLike | Hexable, padding: number) => {
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

export const abiEncode = (valueTypes: readonly (string | ParamType)[], values: readonly any[]) => {
    return AbiCoder.encode(valueTypes, values)
};

export const createGenericDepositData = (hexMetaData: string) => {
    if (hexMetaData === null) {
        return '0x' +
            toHex(0, 32).substr(2) // len(metaData) (32 bytes)
    } 
    const hexMetaDataLength = (hexMetaData.substr(2)).length / 2;
    return '0x' +
        toHex(hexMetaDataLength, 32).substr(2) +
        hexMetaData.substr(2)
};

export const createERCDepositData = (tokenAmountOrID: number | bigint | BytesLike | Hexable, lenRecipientAddress: number | bigint | BytesLike | Hexable , recipientAddress: string) => {
    return '0x' +
        toHex(tokenAmountOrID, 32).substr(2) +      // Token amount or ID to deposit (32 bytes)
        toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)          (32 bytes)
        recipientAddress.substr(2);               // recipientAddress               (?? bytes)
};

export const createResourceID = (contractAddress: string, domainId: number | bigint | BytesLike | Hexable) => {
    return toHex(contractAddress + toHex(domainId, 1).substr(2), 32)
};

export const createERCWithdrawData = (tokenAddress: string, recipientAddress: string, tokenAmountOrID: number | bigint | BytesLike | Hexable) => {
    return '0x' +
        toHex(tokenAddress, 32).substr(2) +
        toHex(recipientAddress, 32).substr(2) +
        toHex(tokenAmountOrID, 32).substr(2);
}