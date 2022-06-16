import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

task("treasury-ultron", "Sets  treasury for ultron")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "ultron") {
            console.error("Should be ultron network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x6025adaD5b1EAC55f24e3e4783E0e881428017e8";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);

        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
    });

task("treasury-ethereum", "Sets  treasury for ethereum")         
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "ethereum") {
            console.error("Should be ethereum network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);

        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);
        await Helpers.delay(6000);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
        await Helpers.delay(6000);

        console.info(`IsVoter [${voterAddress}] = ${await DAO.getVoterStatusByAddress(voterAddress)}`);
    });

task("treasury-bsc", "Sets  treasury for bsc")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "bsc") {
            console.error("Should be bsc network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);
        await Helpers.delay(8000);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
        await Helpers.delay(8000);
        
        console.info(`IsVoter [${voterAddress}] = ${await DAO.getVoterStatusByAddress(voterAddress)}`);
    });

task("treasury-avalanche", "Sets  treasury for avalanche")     
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "avalanche") {
            console.error("Should be avalanche network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);
        await Helpers.delay(4000);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
        await Helpers.delay(4000);
        
        console.info(`IsVoter [${voterAddress}] = ${await DAO.getVoterStatusByAddress(voterAddress)}`);
    });

task("treasury-polygon", "Sets  treasury for polygon")    
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "polygon") {
            console.error("Should be polygon network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);
        await Helpers.delay(4000);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
        await Helpers.delay(4000);
        
        console.info(`IsVoter [${voterAddress}] = ${await DAO.getVoterStatusByAddress(voterAddress)}`);
    });

task("treasury-fantom", "Sets  treasury for fantom")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "fantom") {
            console.error("Should be fantom network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const daoAddress = "0x8C14a978b251eaffdABef5aC48e15568E53D3477";
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        
        const voterAddress = "0x4CE535D6E2D47690e33CA646972807BeB264dFBf"
        
        console.info(await DAO.getActiveVotersCount());      
        await DAO.newVoterRequest(voterAddress);
        await Helpers.delay(4000);

        let iterator = +(await DAO.getActiveVotersCount());
        console.info(iterator);
        await DAO.votersRequestConclusion(iterator);
        await Helpers.delay(4000);
        
        console.info(`IsVoter [${voterAddress}] = ${await DAO.getVoterStatusByAddress(voterAddress)}`);
    });