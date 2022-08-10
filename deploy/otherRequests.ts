import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

task("owner-change-request", "OwnerChange request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getOwnerChangeRequestCount()) + 1;
        console.info(iterator);

        const newOwner = '0xcafecafecafecafecafecafecafecafecafecafe'

        await DAO.newOwnerChangeRequest(newOwner);
    });

task("transfer-request", "Transfer request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getTransferRequestCount()) + 1;
        console.info(iterator);

        const newOwner = '0xcafecafecafecafecafecafecafecafecafecafe'

        const addresses = [newOwner, signer.address]
        const eth = ethers.utils.parseEther("1")

        await DAO.newTransferRequest(addresses, [eth, eth]);
    });

task("pausestatus-request", "PauseStatus request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getPauseStatusRequestCount()) + 1;
        console.info(iterator);

        await DAO.newPauseStatusRequest(false);
    });

task("set-generic", "SetGenericResource request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getSetGenericResourceRequestCount()) + 1;
        console.info(iterator);

        const genericHandlerAddress = '0xC453C52f794661C2c0856936e13df67F0eB82f9e'
        const assetAddress = '0xC28C23035325aF9C8c02f955c40632091d132E26'
        const resourceId = '0x0000000000000000000000C28C23035325aF9C8c02f955c40632091d132E2601'
        const depositFunctionSig = "0x00000000";
        const depositFunctionDepositerOffset = 0;
        const executeFunctionSig = "0x00000000"; 

        await DAO.newSetGenericResourceRequest(genericHandlerAddress, resourceId, assetAddress, depositFunctionSig, depositFunctionDepositerOffset, executeFunctionSig);
    });

task("set-forwarder", "SetForwarder request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getSetForwarderRequestCount()) + 1;
        console.info(iterator);

        const newForwarder = '0xcafecafecafecafecafecafecafecafecafecafe'

        await DAO.newSetForwarderRequest(newForwarder, false);
    });

task("fee-percent-request", "ChangeFeePercent request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getChangeFeePercentRequestCount()) + 1;
        console.info(iterator);

        const feeMaxValue = 1000;
        const feePercent = 1;

        await DAO.newChangeFeePercentRequest(feeMaxValue, feePercent)
    });

task("set-native-for-gas", "SetNativeTokensForGas request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getSetNativeTokensForGasRequestCount()) + 1;
        console.info(iterator);

        const amount = ethers.utils.parseEther("0.1");
        await DAO.newSetNativeTokensForGasRequest(amount);
    });

task("transfer-native", "TransferNative request")      
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0xdd1562d39c96Aa4ed3F360719138De2A030cB9cA";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const iterator = +(await DAO.getTransferNativeRequestCount()) + 1;
        console.info(iterator);

        const recepient = '0x4CE535D6E2D47690e33CA646972807BeB264dFBf';
        const amount = ethers.utils.parseEther("0.1");
        await DAO.newTransferNativeRequest(amount);
    });
