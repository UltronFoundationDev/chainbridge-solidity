import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

/*========== Change FEE ==========*/
task("fee-ultron", "Changing fee for ultron tokens")      
    .setAction(async (_, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0xC453C52f794661C2c0856936e13df67F0eB82f9e";
        const daoAddress = "0xc4A47D97070Dd02F4544a12859f6A23592C8194B";
        const erc20HandlerAddress = "0x6d5a23B55CBDB0Fc7b48794d806f0bcE7Dca99E1";

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

        const ultronToETHTokens = [
            new TokenFee("WBTC", "0xd2b86a80A8f30b83843e247A50eCDc8D843D87dD", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("WETH", "0x2318Bf5809a72AaBAdd15a3453A18e50Bbd651Cd", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("BNB", "0x169ac560852ed79af3D97A8977DCf2EBA54A0488", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("AVAX", "0x6FE94412953D373Ef464b85637218EFA9EAB8e97", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("BUSD", "0xc7cAc85C1779d2B8ADA94EFfff49A4754865e2E4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("SHIB", "0xb5Bb1911cf6C83C1a6E439951C40C2949B0d907f", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("MATIC", "0x6094a1e3919b302E236B447f45c4eb2DeCE9D9F4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("FTM", "0xE8Ef8A6FE387C2D10951a63ca8f37dB6B8fA02C1", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("DAI", "0x045F0f2DE758743c84b756B1Fca735a0dDf0b8f4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("LINK", "0xc8Fb7999d62072E12fE8f3EDcd7821204FCa0344", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("uUSDT", "0x97FDd294024f50c388e39e73F1705a35cfE87656", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("40", 6), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("uUSDC", "0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("40", 6), ethers.utils.parseUnits("50000000", 18)),
        ]

        // uUSDC
        console.info((await DAO.getChangeFeeRequestCount()));
        await DAO.newChangeFeeRequest("0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4", domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(4000);
        await DAO.newChangeFeeRequest("0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4", fantomDomainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));

        for(let i:number = 9; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(4000);
        }

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

task("fee-fantom", "Changing fee for ultron tokens")      
    .setAction(async (_, { ethers }) => {
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x400b3D2Ac98f93e14146E330210910f396f59C1E";
        const daoAddress = "0x8C14a978b251eaffdABef5aC48e15568E53D3477";
        const erc20HandlerAddress = "0x598E5dBC2f6513E6cb1bA253b255A5b73A2a720b";

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

        const ultronToETHTokens = [
            new TokenFee("WBTC", "0xd2b86a80A8f30b83843e247A50eCDc8D843D87dD", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("WETH", "0x2318Bf5809a72AaBAdd15a3453A18e50Bbd651Cd", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("BNB", "0x169ac560852ed79af3D97A8977DCf2EBA54A0488", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("AVAX", "0x6FE94412953D373Ef464b85637218EFA9EAB8e97", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("BUSD", "0xc7cAc85C1779d2B8ADA94EFfff49A4754865e2E4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("SHIB", "0xb5Bb1911cf6C83C1a6E439951C40C2949B0d907f", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("MATIC", "0x6094a1e3919b302E236B447f45c4eb2DeCE9D9F4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("FTM", "0xE8Ef8A6FE387C2D10951a63ca8f37dB6B8fA02C1", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("DAI", "0x045F0f2DE758743c84b756B1Fca735a0dDf0b8f4", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("LINK", "0xc8Fb7999d62072E12fE8f3EDcd7821204FCa0344", ethDomainId, ethers.utils.parseUnits("0.9", 18), ethers.utils.parseUnits("40", 18), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("uUSDT", "0x97FDd294024f50c388e39e73F1705a35cfE87656", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("40", 6), ethers.utils.parseUnits("50000000", 18)),
            new TokenFee("uUSDC", "0x3c4E0FdeD74876295Ca36F62da289F69E3929cc4", ethDomainId, ethers.utils.parseUnits("0.9", 6), ethers.utils.parseUnits("40", 6), ethers.utils.parseUnits("50000000", 18)),
        ]

        // uUSDC
        console.info((await DAO.getChangeFeeRequestCount()));
        await DAO.newChangeFeeRequest("0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", domainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(4000);
        await DAO.newChangeFeeRequest("0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", ulxDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(4000);
        for(let i:number = 9; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(4000);
        }
        


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