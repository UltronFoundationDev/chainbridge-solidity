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

export const createResourceID = (contractAddress: string, domainId: number | bigint | BytesLike | Hexable) => {
    return toHex(contractAddress + toHex(domainId, 1).substr(2), 32)
};

export const createERCWithdrawData = (tokenAddress: string, recipientAddress: string, tokenAmountOrID: number | bigint | BytesLike | Hexable) => {
    return '0x' +
        toHex(tokenAddress, 32).substr(2) +
        toHex(recipientAddress, 32).substr(2) +
        toHex(tokenAmountOrID, 32).substr(2);
}