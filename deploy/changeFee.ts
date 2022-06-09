import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

const ultronDomainId:number = 1;
const ethereumDomainId:number = 2;
const avalancheDomainId:number = 3;
const bscDomainId:number = 4;
const polygonDomainId:number = 5;
const fantomDomainId:number = 6;

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
        
        const chainTokenAddresses = [
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

            new Token("bep_uUSDT",  "0xB8160f15D44604E892Ac52eC4CCBfDA3cafbFDbd"),
            new Token("bep_uUSDC",  "0x06d522b2118d535978382d9533a68B0b110f9BC2"),
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info(iterator);

        // // Already set

        // // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), ethereumDomainId, Helpers.parseDecimals(0.0013, 18), Helpers.parseDecimals(0.003, 18), Helpers.parseDecimals(1000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), bscDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), avalancheDomainId, Helpers.parseDecimals(0.000045, 18), Helpers.parseDecimals(0.0002, 18),  Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), polygonDomainId,Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), fantomDomainId, Helpers.parseDecimals(0.000045, 18), Helpers.parseDecimals(0.0002, 18),  Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ethereumDomainId, Helpers.parseDecimals(0.02, 18), Helpers.parseDecimals(0.05, 18), Helpers.parseDecimals(13000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), bscDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), avalancheDomainId, Helpers.parseDecimals(0.0006, 18), Helpers.parseDecimals(0.006, 18),  Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), polygonDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), fantomDomainId, Helpers.parseDecimals(0.0006, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // // BNB
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BNB"), domainId, Helpers.parseDecimals(0.022, 18), Helpers.parseDecimals(0.044, 18), Helpers.parseDecimals(7500, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BNB"), bscDomainId, Helpers.parseDecimals(0.022, 18), Helpers.parseDecimals(0.044, 18), Helpers.parseDecimals(7500, 18));
        // await Helpers.delay(4000);

        // // AVAX 
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), domainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), bscDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), avalancheDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18),  Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), fantomDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18),  Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);
        
        // // SHIB
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "SHIB"), domainId, Helpers.parseDecimals(1112.5, 18), Helpers.parseDecimals(1112500, 18), Helpers.parseDecimals(620000000000, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "SHIB"), ethereumDomainId, Helpers.parseDecimals(1112500, 18), Helpers.parseDecimals(28000000, 18), Helpers.parseDecimals(620000000000, 18));
        // await Helpers.delay(4000);

        // // MATIC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "MATIC"), domainId, Helpers.parseDecimals(1.8, 18), Helpers.parseDecimals(3.6, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "MATIC"), polygonDomainId, Helpers.parseDecimals(3.43, 18), Helpers.parseDecimals(34.3, 18), Helpers.parseDecimals(3500000, 18));
        // await Helpers.delay(4000);

        // // FTM
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), domainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), ethereumDomainId, Helpers.parseDecimals(53.5, 18), Helpers.parseDecimals(60, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), bscDomainId, Helpers.parseDecimals(2.4, 18), Helpers.parseDecimals(4.8, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), fantomDomainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(4000);
        
        // // LINK
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "LINK"), domainId, Helpers.parseDecimals(0.00273, 18), Helpers.parseDecimals(2.73, 18), Helpers.parseDecimals(230000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "LINK"), ethereumDomainId, Helpers.parseDecimals(2.73, 18), Helpers.parseDecimals(7, 18), Helpers.parseDecimals(230000, 18));
        // await Helpers.delay(4000);

        // // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), ethereumDomainId, Helpers.parseDecimals(40, 18), Helpers.parseDecimals(200, 18), Helpers.parseDecimals(50000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), bscDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(20000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), avalancheDomainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(20000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), polygonDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), fantomDomainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // // BUSD
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), bscDomainId, Helpers.parseDecimals(15, 18), Helpers.parseDecimals(30, 18), Helpers.parseDecimals(5000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), avalancheDomainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(20000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), polygonDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), fantomDomainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // // uUSDT
        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), ethereumDomainId, Helpers.parseDecimals(40, 6), Helpers.parseDecimals(200, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(4000);

        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), bscDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), avalancheDomainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), polygonDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDT"), fantomDomainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // // uUSDC
        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), ethereumDomainId, Helpers.parseDecimals(40, 6), Helpers.parseDecimals(200, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(4000);

        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), bscDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), avalancheDomainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), polygonDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "uUSDC"), fantomDomainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        for(let i:number = iterator; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }


        return domainId;
    });

task("fee-eth", "Changing fee for ethereum tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "ethereum") {
            console.error("Should be ethereum network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x6Ab2A602d1018987Cdcb29aE6fB6E3Ebe44b1412";
        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const erc20HandlerAddress = "0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const chainTokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"), // DONE
            new Token("WETH",   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"), // DONE
            new Token("BNB",    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"), 
            new Token("BUSD",   "0x4Fabb145d64652a948d72533023f6E7A623C7C53"), 
            new Token("SHIB",   "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"), // DONE
            new Token("MATIC",  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"),
            new Token("FTM",    "0x4E15361FD6b4BB609Fa63C81A2be19d873717870"), // DONE
            new Token("DAI",    "0x6B175474E89094C44Da98b954EedeAC495271d0F"), // DONE
            new Token("LINK",   "0x514910771AF9Ca656af840dff83E8264EcF986CA"), // DONE
            new Token("USDT",   "0xdAC17F958D2ee523a2206206994597C13D831ec7"), // DONE
            new Token("USDC",   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"), // DONE
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info((iterator));

        //console.info(`WBTC ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId)}`)
        //console.info(`WBTC UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "WBTC"), ultronDomainId)}`)

        // console.info(`WETH ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "WETH"), domainId)}`)
        // console.info(`WETH UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId)}`)

        // console.info(`FTM ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "FTM"), domainId)}`)
        // console.info(`FTM UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "FTM"), ultronDomainId)}`)

        // console.info(`SHIB ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "SHIB"), domainId)}`)
        // console.info(`SHIB UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "SHIB"), ultronDomainId)}`)

        // console.info(`LINK ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "LINK"), domainId)}`)
        // console.info(`LINK UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "LINK"), ultronDomainId)}`)

        // console.info(`DAI ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "DAI"), domainId)}`)
        // console.info(`DAI UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "DAI"), ultronDomainId)}`)

        // console.info(`USDT ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "USDT"), domainId)}`)
        // console.info(`USDT UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "USDT"), ultronDomainId)}`)

        // console.info(`USDC ETH ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "USDC"), domainId)}`)
        // console.info(`USDC UlX ${await bridge.getFee(Helpers.findToken(chainTokenAddresses, "USDC"), ultronDomainId)}`)

        // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.0013, 18), Helpers.parseDecimals(0.003, 18), Helpers.parseDecimals(1000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), ultronDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(8000);

        // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), domainId, Helpers.parseDecimals(0.02, 18), Helpers.parseDecimals(0.05, 18), Helpers.parseDecimals(13000, 18));
        // console.info(3);
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(8000);

        // FTM
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), domainId, Helpers.parseDecimals(53.5, 18), Helpers.parseDecimals(60, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), ultronDomainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(8000);


        // SHIB
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "SHIB"), domainId, Helpers.parseDecimals(1112500, 18), Helpers.parseDecimals(28000000, 18), Helpers.parseDecimals(620000000000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "SHIB"), ultronDomainId, Helpers.parseDecimals(1112.5, 18), Helpers.parseDecimals(1112500, 18), Helpers.parseDecimals(620000000000, 18));
        // await Helpers.delay(8000);

        // LINK
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "LINK"), domainId, Helpers.parseDecimals(2.73, 18), Helpers.parseDecimals(7, 18), Helpers.parseDecimals(230000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "LINK"), ultronDomainId, Helpers.parseDecimals(0.00273, 18), Helpers.parseDecimals(2.73, 18), Helpers.parseDecimals(230000, 18));
        // await Helpers.delay(8000);
        
        // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(40, 18), Helpers.parseDecimals(200, 18), Helpers.parseDecimals(50000000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(50000000, 18));
        // await Helpers.delay(8000);

        // // USDT
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), domainId, Helpers.parseDecimals(40, 6), Helpers.parseDecimals(200, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(8000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(8000);

        // // USDC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), domainId, Helpers.parseDecimals(40, 6), Helpers.parseDecimals(200, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(50000000, 6));
        // await Helpers.delay(8000);

        for(let i:number = 10; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }

        return domainId;
    });

task("fee-bsc", "Changing fee for bsc tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "bsc") {
            console.error("Should be bsc network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x6Ab2A602d1018987Cdcb29aE6fB6E3Ebe44b1412";
        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const erc20HandlerAddress = "0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const chainTokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"), // DONE
            new Token("WETH",   "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"), // DONE
            new Token("BNB",    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"), // DONE
            new Token("AVAX",   "0x1CE0c2827e2eF14D5C4f29a091d735A204794041"), // DONE
            new Token("BUSD",   "0xe9e7cea3dedca5984780bafc599bd69add087d56"), // DONE
            new Token("SHIB",   "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D"), 
            new Token("MATIC",  "0xcc42724c6683b7e57334c4e856f4c9965ed682bd"),
            new Token("FTM",    "0xad29abb318791d579433d831ed122afeaf29dcfe"), // DONE
            new Token("DAI",    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3"), // DONE
            new Token("LINK",   "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD"), 
            new Token("USDT",   "0x55d398326f99059ff775485246999027b3197955"), // DONE
            new Token("USDC",   "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"), // DONE
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info((iterator));

        // // Already set
        
        // // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), ultronDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(8000);

        // // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), domainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(8000);

        // // BNB
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BNB"), domainId, Helpers.parseDecimals(0.022, 18), Helpers.parseDecimals(0.044, 18), Helpers.parseDecimals(7500, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BNB"), ultronDomainId, Helpers.parseDecimals(0.022, 18), Helpers.parseDecimals(0.044, 18), Helpers.parseDecimals(7500, 18));
        // await Helpers.delay(8000);

        // // AVAX
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), domainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), ultronDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(8000);
        
        // FTM
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), domainId, Helpers.parseDecimals(2.4, 18), Helpers.parseDecimals(4.8, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "FTM"), ultronDomainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(8000);

        // // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(8000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(8000);
        
        // // BUSD
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), bscDomainId, Helpers.parseDecimals(15, 18), Helpers.parseDecimals(30, 18), Helpers.parseDecimals(5000000, 18));
        // await Helpers.delay(8000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(8000);

        // USDT
        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18),  Helpers.parseDecimals(20000000, 18));
        await Helpers.delay(8000);
        
        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18),  Helpers.parseDecimals(2000000, 18));
        await Helpers.delay(8000);

        // // USDC
        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        await Helpers.delay(8000);

        await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18),  Helpers.parseDecimals(2000000, 18));
        await Helpers.delay(8000);

        for(let i:number = iterator; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }

        return domainId;
    });

task("fee-avalanche", "Changing fee for avalanche tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "avalanche") {
            console.error("Should be avalanche network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x6Ab2A602d1018987Cdcb29aE6fB6E3Ebe44b1412";
        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const erc20HandlerAddress = "0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const chainTokenAddresses = [
            // new Token("wULX",   ""), 
            new Token("WBTC",   "0x50b7545627a5162F82A992c33b87aDc75187B218"), // DONE
            new Token("WETH",   "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB"), // DONE
            new Token("BNB",    "0x264c1383EA520f73dd837F915ef3a732e204a493"), 
            new Token("AVAX",   "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"), // DONE
            new Token("BUSD",   "0xaEb044650278731Ef3DC244692AB9F64C78FfaEA"), // DONE
            new Token("SHIB",   "0x02D980A0D7AF3fb7Cf7Df8cB35d9eDBCF355f665"), 
            new Token("DAI",    "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"), // DONE
            new Token("LINK",   "0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651"), 
            new Token("USDT",   "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"), // DONE
            new Token("USDC",   "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"), // DONE
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info((iterator));

        // // Already set

        // // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.000045, 18), Helpers.parseDecimals(0.0002, 18),  Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), ultronDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18),  Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), domainId, Helpers.parseDecimals(0.0006, 18), Helpers.parseDecimals(0.006, 18),  Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18),  Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // // AVAX
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), domainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18),  Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "AVAX"), ultronDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18),  Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // // BUSD
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), domainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // USDT
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), domainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(20000000, 6));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // // USDC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), domainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        for(let i:number = iterator; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }

        return domainId;
    });

task("fee-polygon", "Changing fee for polygon tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "polygon") {
            console.error("Should be polygon network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x6Ab2A602d1018987Cdcb29aE6fB6E3Ebe44b1412";
        const daoAddress = "0x9DcD76b4A7357249d6160D456670bAcC53292e27";
        const erc20HandlerAddress = "0xFe21Dd0eC80e744A473770827E1aD6393A5A94F0";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const chainTokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"), // DONE
            new Token("WETH",   "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"), // DONE
            new Token("BNB",    "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3"), // DONE
            new Token("AVAX",   "0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b"), 
            new Token("BUSD",   "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7"), // DONE
            new Token("MATIC",  "0x0000000000000000000000000000000000001010"), // DONE
            new Token("FTM",    "0xC9c1c1c20B3658F8787CC2FD702267791f224Ce1"), 
            new Token("DAI",    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"), // DONE
            new Token("LINK",   "0xb0897686c545045aFc77CF20eC7A532E3120E0F1"), 
            new Token("USDT",   "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"), // DONE
            new Token("USDC",   "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"), // DONE
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info((iterator));

        // Already set

        // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WBTC"), ultronDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);
        
        // // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), domainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // // MATIC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "MATIC"), domainId, Helpers.parseDecimals(3.43, 18), Helpers.parseDecimals(34.3, 18), Helpers.parseDecimals(3500000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "MATIC"), ultronDomainId, Helpers.parseDecimals(1.8, 18), Helpers.parseDecimals(3.6, 18), Helpers.parseDecimals(2500000, 18));
        // await Helpers.delay(4000);
        
        // // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "DAI"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // // BUSD
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), domainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "BUSD"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // // uUSDT
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDT"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // // uUSDC
        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), domainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(chainTokenAddresses, "USDC"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        for(let i:number = iterator; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }

        return domainId;
    });

task("fee-fantom", "Changing fee for fantom tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "fantom") {
            console.error("Should be fantom network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x400b3D2Ac98f93e14146E330210910f396f59C1E";
        const daoAddress = "0x8C14a978b251eaffdABef5aC48e15568E53D3477";
        const erc20HandlerAddress = "0x598E5dBC2f6513E6cb1bA253b255A5b73A2a720b";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const domainId:BigNumberish = await bridge._domainID(); 
        
        const сhainTokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x321162Cd933E2Be498Cd2267a90534A804051b11"), // DONE
            new Token("WETH",   "0x74b23882a30290451A17c44f4F05243b6b58C76d"), // DONE
            new Token("BNB",    "0x27f26F00e1605903645BbaBC0a73E35027Dccd45"), // DONE
            new Token("AVAX",   "0x511D35c52a3C244E7b8bd92c0C297755FbD89212"), 
            new Token("BUSD",   "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50"), // DONE
            new Token("FTM",    "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"), // DONE
            new Token("DAI",    "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E"), // DONE
            new Token("LINK",   "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8"), 
            new Token("USDT",   "0x049d68029688eabf473097a2fc38ef61633a3c7a"), // DONE
            new Token("USDC",   "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"), // DONE
        ];

        const iterator = +(await DAO.getChangeFeeRequestCount()) + 1;
        console.info((iterator));

        // // Already set
        // // WBTC
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "WBTC"), domainId, Helpers.parseDecimals(0.000045, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "WBTC"), ultronDomainId, Helpers.parseDecimals(0.00002, 18), Helpers.parseDecimals(0.0002, 18), Helpers.parseDecimals(430, 18));
        // await Helpers.delay(4000);

        // // WETH
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "WETH"), domainId, Helpers.parseDecimals(0.0006, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "WETH"), ultronDomainId, Helpers.parseDecimals(0.0003, 18), Helpers.parseDecimals(0.006, 18), Helpers.parseDecimals(9640, 18));
        // await Helpers.delay(4000);

        // // AVAX
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "AVAX"), domainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "AVAX"), ultronDomainId, Helpers.parseDecimals(0.08, 18), Helpers.parseDecimals(0.16, 18), Helpers.parseDecimals(80000, 18));
        // await Helpers.delay(4000);

        // FTM
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "FTM"), domainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "FTM"), ultronDomainId, Helpers.parseDecimals(1.7, 18), Helpers.parseDecimals(3.4, 18), Helpers.parseDecimals(1700000, 18));
        // await Helpers.delay(4000);

        // // DAI
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "DAI"), domainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "DAI"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // // BUSD
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "BUSD"), domainId, Helpers.parseDecimals(1.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "BUSD"), ultronDomainId, Helpers.parseDecimals(0.9, 18), Helpers.parseDecimals(12, 18), Helpers.parseDecimals(2000000, 18));
        // await Helpers.delay(4000);

        // // USDT
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "USDT"), domainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);
        
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "USDT"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // // USDC
        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "USDC"), domainId, Helpers.parseDecimals(1.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        // await DAO.newChangeFeeRequest(Helpers.findToken(сhainTokenAddresses, "USDC"), ultronDomainId, Helpers.parseDecimals(0.9, 6), Helpers.parseDecimals(12, 6),  Helpers.parseDecimals(2000000, 6));
        // await Helpers.delay(4000);

        for(let i:number = iterator; i <= (await DAO.getChangeFeeRequestCount()); i++) {
            await bridge.adminChangeFee(i);
            console.info(`adminChangeFeeRequest ${i}`)    
            await Helpers.delay(8000);
        }

        return domainId;
    });