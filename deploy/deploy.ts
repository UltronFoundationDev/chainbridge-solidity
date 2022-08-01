import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

task("deploy", "deploy everything")
    .setAction(async (_, { run, ethers, network }) => {
        const bridge = await run("bridge");
        const erc20Handler = await run("ERC20Handler", { bridge: bridge });
        const daoContract = await run("dao", { bridge: bridge, erc20Handler: erc20Handler });
        
        const setInitialContracts = await run("setInitialContracts", {
            bridge: bridge, erc20Handler: erc20Handler, dao: daoContract
        });

        console.log("=".repeat(50));
        Helpers.logDeploy("bridge", "Impl", bridge);
        Helpers.logDeploy("DAOContract", "Impl", daoContract);
        Helpers.logDeploy("ERC20Handler", "Impl", erc20Handler);
        console.log("Set initial contracts: " + setInitialContracts);
        // if(network.name == "ultron") {
        //     const deployTokens = await run("deploy-tokens", { erc20Handler: erc20Handler });
        //     console.log("Deployed tokens: " + deployTokens);
        // }
    });


/*========== Bridge ==========*/
subtask("bridge", "The contract Bridge is deployed")
    .setAction(async (_, { ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        let domainId:BigNumberish = 0;
        if(network.name === "ultron") {
            domainId = 1;
        }
        if(network.name === "ethereum") {
            domainId = 2;
        }
        if(network.name === "bsc") {
            domainId = 3;
        }
        if(network.name === "avalanche") {
            domainId = 4;
        }
        if(network.name === "polygon") {
            domainId = 5;
        }
        if(network.name === "fantom") {
            domainId = 6;
        }

        const initialRealyers:string[] = [
            `${signer.address}`, 
            "0x8599FdA43D7CE910352ffe9a3E5F34E0b6d3867E",
            "0xd0C34eaC64B8053Bd5Aef1a16deEdbBf83E638a7",
            "0xe5640686419D526c1d0813ace59fd7751F584232",
        ];

        const initialRelayerThreshold:BigNumberish = 2;

        const expiry:BigNumberish = 40;
        const feeMaxValue:BigNumberish = 10000;
        const feePercent:BigNumberish = 10;

        if(domainId !== 0) {
            const bridgeFactory = await ethers.getContractFactory("Bridge", signer);
            const bridge = await (await bridgeFactory.deploy(domainId, initialRealyers, initialRelayerThreshold, expiry, feeMaxValue, feePercent)).deployed();
            console.log(`The Bridge: \u001b[1;34m${bridge.address}\u001b[0m`);    
            return bridge.address;
        }
        else {
            console.info(`Should add ${network.name}!`)
        }
    });

/*========== ERC20Handler ==========*/
subtask("ERC20Handler", "The contract ERC20Handler is deployed")
    .addParam("bridge", "bridge address")
    .setAction(async (taskArgs, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const treasuryAddress = "0x976B649bacA4CB2af970e091B45d862965520276";
        
        const ERC20HandlerFactory = await ethers.getContractFactory("ERC20Handler", signer);
        const ERC20Handler = await (await ERC20HandlerFactory.deploy(taskArgs.bridge, treasuryAddress)).deployed();
        console.log(`The ERC20Handler: \u001b[1;34m${ERC20Handler.address}\u001b[0m`);
        
        return ERC20Handler.address;
    });

/*========== DAO ==========*/
subtask("dao", "The contract DAO is deployed")   
    .addParam("bridge", "bridge address")
    .addParam("erc20Handler", "ERC20Handler address")
    .setAction(async (taskArgs, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const DAOFactory = await ethers.getContractFactory("DAO", signer);
        const DAO = await (await DAOFactory.deploy(taskArgs.bridge, taskArgs.erc20Handler)).deployed();
        console.log(`The DAO: \u001b[1;34m${DAO.address}\u001b[0m`);

        return DAO.address;
    });

/*========== Set DAO Contracts ==========*/
subtask("setInitialContracts", "Set Initial Contracts successfully")     
    .addParam("bridge", "bridge address")
    .addParam("erc20Handler", "ERC20Handler address")
    .addParam("dao", "DAO address")
    .setAction(async (taskArgs, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const bridge = await ethers.getContractAt("Bridge", taskArgs.bridge, signer);
        const ERC20Handler = await ethers.getContractAt("ERC20Handler", taskArgs.erc20Handler, signer);
        
        await bridge.setDAOContractInitial(taskArgs.dao);
        await Helpers.delay(4000);
        console.info(await bridge.getContractDAO());
        
        await ERC20Handler.setDAOContractInitial(taskArgs.dao);
        await Helpers.delay(4000);
        console.info(await ERC20Handler.getDAOAddress());

        return true;
    });

/*========== Deploy Tokens ==========*/
subtask("deploy-tokens", "Deploying default tokens for our chain")
    .addParam("erc20Handler", "erc20Handler address")     
    .setAction(async (taskArgs, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const erc20CustomFactory = await ethers.getContractFactory("ERC20Custom", signer);
        const erc20StableFactory = await ethers.getContractFactory("ERC20Stable", signer);

        const wBTC = await (await erc20CustomFactory.deploy("Wrapped Bitcoin", "wBTC")).deployed();
        await wBTC.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The WBTC: \u001b[1;34m${wBTC.address}\u001b[0m`);

        const wETH = await (await erc20CustomFactory.deploy("Wrapped Ethereum", "wETH")).deployed();
        await wETH.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The WETH: \u001b[1;34m${wETH.address}\u001b[0m`);

        const bnb = await (await erc20CustomFactory.deploy("BNB", "BNB")).deployed();
        await bnb.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The BNB: \u001b[1;34m${bnb.address}\u001b[0m`);

        const avax = await (await erc20CustomFactory.deploy("Avalanche", "AVAX")).deployed();
        await avax.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The AVAX: \u001b[1;34m${avax.address}\u001b[0m`);

        const bUSD = await (await erc20CustomFactory.deploy("Binance USD", "BUSD")).deployed();
        await bUSD.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The BUSD: \u001b[1;34m${bUSD.address}\u001b[0m`);

        const shib = await (await erc20CustomFactory.deploy("Shiba Inu", "SHIB")).deployed();
        await shib.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The SHIB: \u001b[1;34m${shib.address}\u001b[0m`);

        const matic = await (await erc20CustomFactory.deploy("Polygon", "MATIC")).deployed();
        await matic.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The MATIC: \u001b[1;34m${matic.address}\u001b[0m`);

        const ftm = await (await erc20CustomFactory.deploy("Fantom", "FTM")).deployed();
        await ftm.grantMinterRole(taskArgs.erc20Handle);
        console.log(`The FTM: \u001b[1;34m${ftm.address}\u001b[0m`);

        const dai = await (await erc20CustomFactory.deploy("Dai", "DAI")).deployed();
        await dai.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The DAI: \u001b[1;34m${dai.address}\u001b[0m`);

        const link = await (await erc20CustomFactory.deploy("Chainlink", "LINK")).deployed();
        await link.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The LINK: \u001b[1;34m${link.address}\u001b[0m`);    

        const uUSDT = await (await erc20StableFactory.deploy("Ultron Tether", "uUSDT")).deployed();
        await uUSDT.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The uUSDT: \u001b[1;34m${uUSDT.address}\u001b[0m`);

        const uUSDC = await (await erc20StableFactory.deploy("Ultron USD Coin", "uUSDC")).deployed();
        await uUSDC.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The uUSDC: \u001b[1;34m${uUSDC.address}\u001b[0m`);

        const bep_uUSDT = await (await erc20CustomFactory.deploy("Ultron BEP-Tether", "Bep-uUSDT")).deployed();
        await bep_uUSDT.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The bep_uUSDT: \u001b[1;34m${bep_uUSDT.address}\u001b[0m`);

        const bep_uUSDC = await (await erc20CustomFactory.deploy("Ultron BEP-USD Coin", "Bep-uUSDC")).deployed();
        await bep_uUSDC.grantMinterRole(taskArgs.erc20Handler);
        console.log(`The bep_uUSDC: \u001b[1;34m${bep_uUSDC.address}\u001b[0m`);

        return [wBTC.address, wETH.address, bnb.address, avax.address, bUSD.address, shib.address, matic.address, 
            ftm.address, dai.address, link.address, uUSDT.address, uUSDC.address, bep_uUSDT.address, bep_uUSDC.address];
    });

/*========== Deploy ULX ==========*/
task("deploy-ulx", "Deploying ULX for different chains")     
    .setAction(async (taskArgs, { ethers, network }) => {
        let erc20HandlerAddress;
        if(network.name === "ultron") {
            return;
        }     
        else if(network.name === "ethereum") {
            erc20HandlerAddress = '0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0';
        }
        else if(network.name === "bsc") {
            erc20HandlerAddress = '0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0';
        }
        else if(network.name === "avalanche") {
            erc20HandlerAddress = '0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0';
        }
        else if(network.name === "polygon") {
            erc20HandlerAddress = '0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0';
        }
        else if(network.name === "fantom") {
            erc20HandlerAddress = '0x598E5dBC2f6513E6cb1bA253b255A5b73A2a720b';
        }       
        
        const signer = (await ethers.getSigners())[0];

        const erc20CustomFactory = await ethers.getContractFactory("ERC20Custom", signer);

        const ulx = await (await erc20CustomFactory.deploy("Ultron", "ULX")).deployed();
        await ulx.grantMinterRole(erc20HandlerAddress);
        console.log(`The ULX: \u001b[1;34m${ulx.address}\u001b[0m`);

        return [ulx.address];
    });