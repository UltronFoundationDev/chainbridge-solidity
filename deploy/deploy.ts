import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee } from "./tokenFee";

task("deploy", "deploy everything")
    .setAction(async (_, { run, ethers, network }) => {
        const bridge = await run("bridge");
        const erc20Handler = await run("ERC20Handler", { bridge: bridge });
        const daoContract = await run("dao", { bridge: bridge, erc20Handler: erc20Handler });
        
        const setInitialContracts = await run("setInitialContracts", {
            bridge: bridge, erc20Handler: erc20Handler, dao: daoContract
        });

        //const deployTokens = await run("deploy-tokens", { erc20Handler: erc20Handler });

        console.log("=".repeat(50));
        Helpers.logDeploy("bridge", "Impl", bridge);
        Helpers.logDeploy("DAOContract", "Impl", daoContract);
        Helpers.logDeploy("ERC20Handler", "Impl", erc20Handler);
        console.log("Set initial contracts: " + setInitialContracts);
        //console.log("Deployed tokens: " + deployTokens);
    });


/*========== Bridge ==========*/
subtask("bridge", "The contract Bridge is deployed")
    .setAction(async (_, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const domainId:BigNumberish = 1;
        const initialRealyers:string[] = [`${signer.address}`];
        const initialRelayerThreshold:BigNumberish = initialRealyers.length;
        const expiry:BigNumberish = 40;
        const feeMaxValue:BigNumberish = 10000;
        const feePercent:BigNumberish = 10;

        const bridgeFactory = await ethers.getContractFactory("Bridge", signer);
        const bridge = await (await bridgeFactory.deploy(domainId, initialRealyers, initialRelayerThreshold, expiry, feeMaxValue, feePercent)).deployed();
        console.log(`The Bridge: \u001b[1;34m${bridge.address}\u001b[0m`);
        
        return bridge.address;
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
        await ERC20Handler.setDAOContractInitial(taskArgs.dao);

        return true;
    });

/*========== Deploy Tokens ==========*/
subtask("deploy-tokens", "Deploying default tokens for our chain")     
    .setAction(async (taskArgs, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const erc20CustomFactory = await ethers.getContractFactory("ERC20Custom", signer);
        const erc20StableFactory = await ethers.getContractFactory("ERC20Stable", signer);

        const wBTC = await (await erc20CustomFactory.deploy("Fantom", "FTM")).deployed();
        await wBTC.grantMinterRole("0x598E5dBC2f6513E6cb1bA253b255A5b73A2a720b");
        console.log(`The FTM: \u001b[1;34m${wBTC.address}\u001b[0m`);

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
        await ftm.grantMinterRole("0x598E5dBC2f6513E6cb1bA253b255A5b73A2a720b");
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

        return [wBTC.address, wETH.address, bnb.address, avax.address, bUSD.address, shib.address, 
            matic.address, ftm.address, dai.address, link.address, uUSDT.address, uUSDC.address];
    });

task("set-resource-ids-burnable", "Setting burnable and resource Ids for tokens")      
    .setAction(async (_, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0xF2E6a8f6AcF1e53b8A507Be40F95AeA990472ebC";
        const daoAddress = "0xA093Eb1AF583Ff6Db269862bb46D7D9B97AD2740";
        const erc20HandlerAddress = "0x0088269136c6839c3763BD0EFC6C983788563b02";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const ourChainTokenAddresses = [
            new Token("WBTC",   "0xd2b86a80A8f30b83843e247A50eCDc8D843D87dD"), 
            new Token("WETH",   "0x2318Bf5809a72AaBAdd15a3453A18e50Bbd651Cd"), 
            new Token("BNB",    "0x169ac560852ed79af3D97A8977DCf2EBA54A0488"), 
            new Token("AVAX",   "0x6FE94412953D373Ef464b85637218EFA9EAB8e97"), 
            new Token("BUSD",   "0xc7cAc85C1779d2B8ADA94EFfff49A4754865e2E4"), 
            new Token("SHIB",   "0xb5Bb1911cf6C83C1a6E439951C40C2949B0d907f"), 
            new Token("MATIC",  "0x6094a1e3919b302E236B447f45c4eb2DeCE9D9F4"),
            new Token("FTM",    "0xE8Ef8A6FE387C2D10951a63ca8f37dB6B8fA02C1"), 
            new Token("DAI",    "0x045F0f2DE758743c84b756B1Fca735a0dDf0b8f4"),
            new Token("LINK",   "0xc8Fb7999d62072E12fE8f3EDcd7821204FCa0344"), 
            new Token("uUSDT",  "0x97FDd294024f50c388e39e73F1705a35cfE87656"),
            new Token("uUSDC",  "0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4"),
        ];

        console.info(await DAO.getSetResourceRequestCount());
        console.info(await DAO.getSetBurnableRequestCount());

        let resourceIds: string[] = [];
        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            resourceIds.push(Helpers.createResourceID(ourChainTokenAddresses[i - 1].tokenAddress, domainId));
            await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1], ourChainTokenAddresses[i - 1].tokenAddress);
        }

        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await bridge.adminSetResource(i);    
            console.info(`[${ourChainTokenAddresses[i - 1].tokenName}] [${ourChainTokenAddresses[i - 1].tokenAddress}] - resource id [${resourceIds[i - 1]}]`);
        }

        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await DAO.newSetBurnableRequest(erc20HandlerAddress, ourChainTokenAddresses[i - 1].tokenAddress);
        }

        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await bridge.adminSetBurnable(i);
        }

        return true;
    });

/*========== Change FEE ==========*/
task("changeFee-ultron", "Changing fee for ultron tokens")      
    .setAction(async (_, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0xF2E6a8f6AcF1e53b8A507Be40F95AeA990472ebC";
        const daoAddress = "0xA093Eb1AF583Ff6Db269862bb46D7D9B97AD2740";
        const erc20HandlerAddress = "0x0088269136c6839c3763BD0EFC6C983788563b02";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const ulxDomainId:number = 1;
        const ethDomainId:number = 2;
        const avaxDomainId:number = 3;
        const bnbDomainId:number = 4;
        const polygonDomainId:number = 5;
        const fantomDomainId:number = 6;
        
        const ourChainTokenAddresses = [
            new Token("WBTC",   "0xd2b86a80A8f30b83843e247A50eCDc8D843D87dD"), 
            new Token("WETH",   "0x2318Bf5809a72AaBAdd15a3453A18e50Bbd651Cd"), 
            new Token("BNB",    "0x169ac560852ed79af3D97A8977DCf2EBA54A0488"), 
            new Token("AVAX",   "0x6FE94412953D373Ef464b85637218EFA9EAB8e97"), 
            new Token("BUSD",   "0xc7cAc85C1779d2B8ADA94EFfff49A4754865e2E4"), 
            new Token("SHIB",   "0xb5Bb1911cf6C83C1a6E439951C40C2949B0d907f"), 
            new Token("MATIC",  "0x6094a1e3919b302E236B447f45c4eb2DeCE9D9F4"),
            new Token("FTM",    "0xE8Ef8A6FE387C2D10951a63ca8f37dB6B8fA02C1"), 
            new Token("DAI",    "0x045F0f2DE758743c84b756B1Fca735a0dDf0b8f4"),
            new Token("LINK",   "0xc8Fb7999d62072E12fE8f3EDcd7821204FCa0344"), 
            new Token("uUSDT",  "0x97FDd294024f50c388e39e73F1705a35cfE87656"),
            new Token("uUSDC",  "0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4"),
        ];
        
        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await DAO.newChangeFeeRequest(ourChainTokenAddresses[i - 1].tokenAddress, domainId, basicFee, minAmount, maxAmount);
        }

        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await DAO.newChangeFeeRequest(ourChainTokenAddresses[i - 1].tokenAddress, domainId, basicFee, minAmount, maxAmount);
        }

        for(let i:number = 1; i <= ourChainTokenAddresses.length; i++) {
            await DAO.newChangeFeeRequest(ourChainTokenAddresses[i - 1].tokenAddress, domainId, basicFee, minAmount, maxAmount);
        }

        console.log(`\nSet New Fee for token ${tokenAddress} on destination chain ${destinationId}`);
        await DAO.newChangeFeeRequest(tokenAddress, domainId, basicFee, minAmount, maxAmount);
        await bridge.adminChangeFee( (await DAO.getChangeFeeRequestCount()) + 1);
        console.log(`\nSet New Fee for dest token ${tokenAddress} on domain chain ${domainId}`);

        const ethToUltronTokens = [
            new TokenFee("USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("40", 6), ethers.utils.parseUnits("50000000", 6)),
            new TokenFee("USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("0.0013", 6), ethers.utils.parseUnits("50000000", 6)),
            new TokenFee("ETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", ethDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("0.002", 18), ethers.utils.parseUnits("13000", 18)),
            new TokenFee("WBTC", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", ethDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("1000", 18)),
            new TokenFee("AVAX", "", ethDomainId, ethers.utils.parseUnits("0.08", 18), ethers.utils.parseUnits("0.16", 18), ethers.utils.parseUnits("80000", 18)), 
            new TokenFee("SHIB", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", ethDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("1112500", 18), ethers.utils.parseUnits("620000000000", 18)),
            new TokenFee("DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)), 
            new TokenFee("LINK", "0x514910771AF9Ca656af840dff83E8264EcF986CA", ethDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("2.73", 18), ethers.utils.parseUnits("230000", 18)), 
        ];

        const avaxToUltronTokens = [
            new TokenFee("USDT", "0xde3A24028580884448a5397872046a019649b084", avaxDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("USDT.e", "0xc7198437980c041c805A1EDcbA50c1Ce5db95118", avaxDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("wETH.e", "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", avaxDomainId, ethers.utils.parseUnits("0.0003", 18), ethers.utils.parseUnits("0.006", 18), ethers.utils.parseUnits("9640", 18)),
            new TokenFee("WBTC", "0x50b7545627a5162F82A992c33b87aDc75187B218", avaxDomainId, ethers.utils.parseUnits("0.00002", 18), ethers.utils.parseUnits("0.0002", 18), ethers.utils.parseUnits("430", 18)),
            new TokenFee("AVAX", "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", avaxDomainId, ethers.utils.parseUnits("0.08", 18), ethers.utils.parseUnits("0.16", 18), ethers.utils.parseUnits("80000", 18)), 
            new TokenFee("DAI.e", "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70", avaxDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("12", 18), ethers.utils.parseUnits("20000000", 18)), 
        ];

        const bnbToUltronTokens = [
            new TokenFee("USDT", "0x55d398326f99059fF775485246999027B3197955", bnbDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("USDC", "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", bnbDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("wETH", "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", bnbDomainId, ethers.utils.parseUnits("0.0003", 18), ethers.utils.parseUnits("0.006", 18), ethers.utils.parseUnits("9640", 18)),
            new TokenFee("BNB", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", bnbDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("0.044", 18), ethers.utils.parseUnits("7500", 18)),
            new TokenFee("AVAX", "0x1CE0c2827e2eF14D5C4f29a091d735A204794041", bnbDomainId, ethers.utils.parseUnits("0.08", 18), ethers.utils.parseUnits("0.16", 18), ethers.utils.parseUnits("80000", 18)), 
            new TokenFee("BUSD", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", bnbDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("30", 18), ethers.utils.parseUnits("5000000", 18)),
            new TokenFee("DAI", "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", bnbDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("12", 18), ethers.utils.parseUnits("20000000", 18)), 
        ];

        const polygonToUltronTokens = [
            new TokenFee("USDT", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", polygonDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("USDC", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", polygonDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("wETH", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", polygonDomainId, ethers.utils.parseUnits("0.0003", 18), ethers.utils.parseUnits("0.006", 18), ethers.utils.parseUnits("9640", 18)),
            new TokenFee("wBTC", "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", polygonDomainId, ethers.utils.parseUnits("0.00002", 18), ethers.utils.parseUnits("0.0002", 18), ethers.utils.parseUnits("430", 18)),
            new TokenFee("MATIC", "0x0000000000000000000000000000000000001010", polygonDomainId, ethers.utils.parseUnits("0", 18), ethers.utils.parseUnits("3.43", 18), ethers.utils.parseUnits("3500000", 18)), 
            new TokenFee("DAI", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", polygonDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("12", 18), ethers.utils.parseUnits("20000000", 18)), 
        ];

        const fantomToUltronTokens = [
            new TokenFee("fUSDT", "0x049d68029688eAbF473097a2fC38ef61633A3C7A", fantomDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("USDC", "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", fantomDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("12", 6), ethers.utils.parseUnits("20000000", 6)),
            new TokenFee("fETH", "0x658b0c7613e890EE50B8C4BC6A3f41ef411208aD", fantomDomainId, ethers.utils.parseUnits("0.0003", 18), ethers.utils.parseUnits("0.006", 18), ethers.utils.parseUnits("9640", 18)),
            new TokenFee("fBTC", "0xe1146b9AC456fCbB60644c36Fd3F868A9072fc6E", fantomDomainId, ethers.utils.parseUnits("0.00002", 18), ethers.utils.parseUnits("0.0002", 18), ethers.utils.parseUnits("430", 18)),
            new TokenFee("AVAX", "0x511D35c52a3C244E7b8bd92c0C297755FbD89212", fantomDomainId, ethers.utils.parseUnits("0.08", 18), ethers.utils.parseUnits("0.16", 18), ethers.utils.parseUnits("80000", 18)), 
            new TokenFee("DAI", "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", fantomDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("12", 18), ethers.utils.parseUnits("20000000", 18)), 
        ];

        // await DAO.newChangeFeeRequest(tokenAddress, destinationId, basicFee, minAmount, maxAmount);
        // await bridge.adminChangeFee( (await DAO.getChangeFeeRequestCount())  + 1);
        // console.log(`\nSet New Fee for token ${tokenAddress} on destination chain ${destinationId}`);
        // await DAO.newChangeFeeRequest(tokenAddress, domainId, basicFee, minAmount, maxAmount);
        // await bridge.adminChangeFee( (await DAO.getChangeFeeRequestCount()) + 1);
        // console.log(`\nSet New Fee for dest token ${tokenAddress} on domain chain ${domainId}`);

        return domainId;
    });