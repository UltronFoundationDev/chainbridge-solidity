import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";
import { Token, TokenFee, TokenResourceId } from "./tokenFee";

task("set-resource-ids-burnable", "Setting burnable and resource Ids for tokens")      
    .setAction(async (_, { ethers, network }) => {
        if(network.name != "ultron") {
            console.error("Should be ultron network!");
            return;
        }
        const signer = (await ethers.getSigners())[0];

        const bridgeAddress = "0x61488630B3337b9b897eF3A0AB47CB180399CEa3";
        const erc20HandlerAddress = "0xc078626DA5C09DC63A7c5C0c030f431EFfF098b8";
        const daoAddress = "0x6025adaD5b1EAC55f24e3e4783E0e881428017e8";

        // Old used for first tests:
        // const bridgeAddress = "0xC453C52f794661C2c0856936e13df67F0eB82f9e";
        // const daoAddress = "0xc4A47D97070Dd02F4544a12859f6A23592C8194B";
        // const erc20HandlerAddress = "0x6d5a23B55CBDB0Fc7b48794d806f0bcE7Dca99E1";

        const bridge = await ethers.getContractAt("Bridge", bridgeAddress, signer);
        const DAO = await ethers.getContractAt("DAO", daoAddress, signer);
        const ERC20Handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);

        const domainId:BigNumberish = await bridge._domainID();

        const tokenAddresses = [
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

        for(let i:number = 1; i <= tokenAddresses.length - 4; i++) {
            let token = await ethers.getContractAt("ERC20Custom", tokenAddresses[i - 1].tokenAddress, signer);
            let role = await token.MINTER_ROLE(); 
            // await token.grantMinterRole(erc20HandlerAddress);
            // await Helpers.delay(4000);
            console.info(`${tokenAddresses[i - 1].tokenName} ${await token.hasRole(role, erc20HandlerAddress)}`);
        }

        for(let i:number = tokenAddresses.length - 3; i <= tokenAddresses.length; i++) {
            let token = await ethers.getContractAt("ERC20Stable", tokenAddresses[i - 1].tokenAddress, signer);
            let role = await token.MINTER_ROLE(); 
            // await token.grantMinterRole(erc20HandlerAddress);
            // await Helpers.delay(4000);
            console.info(`${tokenAddresses[i - 1].tokenName} ${await token.hasRole(role, erc20HandlerAddress)}`);
        }

        const resourceIds = [
            //new TokenResourceId("wULX",   ""),
            new TokenResourceId("WBTC",      "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",      "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",       "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("AVAX",      "0x0000000000000000000000b5be0484fb6118401f5377c32ec3f1e530cc181501"),
            new TokenResourceId("BUSD",      "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("SHIB",      "0x000000000000000000000049f1b81eca2b0d1e3aa82e64934292a6b59ad61b01"),
            new TokenResourceId("MATIC",     "0x0000000000000000000000cecc5727d1e5e4af94304ef98b559b00183cbeac01"),
            new TokenResourceId("FTM",       "0x0000000000000000000000df1c1c2f3305bb6e082d382a15eb9c048dc4c58a01"),
            new TokenResourceId("DAI",       "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",      "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("uUSDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("uUSDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),

            new TokenResourceId("bep_uUSDT", "0x0000000000000000000000b8160f15d44604e892ac52ec4ccbfda3cafbfdbd01"),
            new TokenResourceId("bep_uUSDC", "0x000000000000000000000006d522b2118d535978382d9533a68b0b110f9bc201"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`Minter ${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }

        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let isBurnable = await handler._burnList(tokenAddresses[i - 1].tokenAddress); 
            console.info(`Burnable ${tokenAddresses[i - 1].tokenName} - ${isBurnable}`);
        }
        
        // const iteratorResource = +(await DAO.getSetResourceRequestCount()) + 1;
        // console.info(iteratorResource);   
        // const iteratorBurnable = +(await DAO.getSetBurnableRequestCount()) + 1;     
        // console.info(iteratorBurnable);

        // // let resourceIds: string[] = [];
        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     // resourceIds.push(Helpers.createResourceID(tokenAddresses[i - 1].tokenAddress, domainId));
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`newSetResourceRequest ${await DAO.getSetResourceRequestCount()}`)
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iteratorResource; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);    
        //     console.info(`adminSetResource ${i}`)
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetBurnableRequest(erc20HandlerAddress, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`newSetBurnableRequest ${await DAO.getSetBurnableRequestCount()}`)
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iteratorBurnable; i <= (await DAO.getSetBurnableRequestCount()); i++) {
        //     await bridge.adminSetBurnable(i);
        //     console.info(`adminSetBurnable ${i}`)
        //     await Helpers.delay(4000);
        // }

        return true;
    });

task("set-resource-ids-eth", "Setting resource Ids for tokens")      
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
        
        const tokenAddresses = [
            // new Token("wULX",   ""), 
            new Token("WBTC",   "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"), 
            new Token("WETH",   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"), 
            new Token("BNB",    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"), 
            new Token("BUSD",   "0x4Fabb145d64652a948d72533023f6E7A623C7C53"), 
            new Token("SHIB",   "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"), 
            new Token("MATIC",  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"),
            new Token("FTM",    "0x4E15361FD6b4BB609Fa63C81A2be19d873717870"), 
            new Token("DAI",    "0x6B175474E89094C44Da98b954EedeAC495271d0F"),
            new Token("LINK",   "0x514910771AF9Ca656af840dff83E8264EcF986CA"), 
            new Token("USDT",   "0xdAC17F958D2ee523a2206206994597C13D831ec7"),
            new Token("USDC",   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
        ];

        const resourceIds = [
            // new TokenResourceId("wULX",     ""),
            new TokenResourceId("WBTC",     "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",     "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",      "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("BUSD",     "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("SHIB",     "0x000000000000000000000049f1b81eca2b0d1e3aa82e64934292a6b59ad61b01"),
            new TokenResourceId("MATIC",    "0x0000000000000000000000cecc5727d1e5e4af94304ef98b559b00183cbeac01"),
            new TokenResourceId("FTM",      "0x0000000000000000000000df1c1c2f3305bb6e082d382a15eb9c048dc4c58a01"),
            new TokenResourceId("DAI",      "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",     "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("USDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("USDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }

        // const iterator = +(await DAO.getSetResourceRequestCount()) + 1;
        // console.info(iterator);

        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`SetResourceRequest ${i}`)    
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iterator; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);
        //     console.info(`adminSetResource ${i}`)    
        //     await Helpers.delay(4000);
        // }

        return true;
    });

task("set-resource-ids-bsc", "Setting resource Ids for tokens")      
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
        
        const tokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"), 
            new Token("WETH",   "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"), 
            new Token("BNB",    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"), 
            new Token("AVAX",   "0x1CE0c2827e2eF14D5C4f29a091d735A204794041"), 
            new Token("BUSD",   "0xe9e7cea3dedca5984780bafc599bd69add087d56"), 
            new Token("SHIB",   "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D"), 
            new Token("MATIC",  "0xcc42724c6683b7e57334c4e856f4c9965ed682bd"),
            new Token("FTM",    "0xad29abb318791d579433d831ed122afeaf29dcfe"), 
            new Token("DAI",    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3"),
            new Token("LINK",   "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD"), 
            new Token("USDT",   "0x55d398326f99059ff775485246999027b3197955"),
            new Token("USDC",   "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"),
        ];

        const resourceIds = [
            //new TokenResourceId("wULX",   ""),
            new TokenResourceId("WBTC",     "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",     "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",      "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("AVAX",     "0x0000000000000000000000b5be0484fb6118401f5377c32ec3f1e530cc181501"),
            new TokenResourceId("BUSD",     "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("SHIB",     "0x000000000000000000000049f1b81eca2b0d1e3aa82e64934292a6b59ad61b01"),
            new TokenResourceId("MATIC",    "0x0000000000000000000000cecc5727d1e5e4af94304ef98b559b00183cbeac01"),
            new TokenResourceId("FTM",      "0x0000000000000000000000df1c1c2f3305bb6e082d382a15eb9c048dc4c58a01"),
            new TokenResourceId("DAI",      "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",     "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("USDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("USDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),

            new TokenResourceId("bep_uUSDT", "0x0000000000000000000000b8160f15d44604e892ac52ec4ccbfda3cafbfdbd01"),
            new TokenResourceId("bep_uUSDC", "0x000000000000000000000006d522b2118d535978382d9533a68b0b110f9bc201"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }

        // const iterator = +(await DAO.getSetResourceRequestCount()) + 1;
        // console.info(iterator);

        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`SetResourceRequest ${i}`)    
        //     await Helpers.delay(8000);
        // }

        // for(let i:number = iterator; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);
        //     console.info(`adminSetResource ${i}`)    
        //     await Helpers.delay(8000);
        // }

        return true;
    });

task("set-resource-ids-avalanche", "Setting resource Ids for tokens")      
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
        
        const tokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x50b7545627a5162F82A992c33b87aDc75187B218"), 
            new Token("WETH",   "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB"), 
            new Token("BNB",    "0x264c1383EA520f73dd837F915ef3a732e204a493"), 
            new Token("AVAX",   "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"), 
            new Token("BUSD",   "0xaEb044650278731Ef3DC244692AB9F64C78FfaEA"), 
            new Token("SHIB",   "0x02D980A0D7AF3fb7Cf7Df8cB35d9eDBCF355f665"), 
            new Token("DAI",    "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"),
            new Token("LINK",   "0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651"), 
            new Token("USDT",   "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"),
            new Token("USDC",   "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"),
        ];

        const resourceIds = [
            //new TokenResourceId("wULX",   ""),
            new TokenResourceId("WBTC",     "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",     "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",      "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("AVAX",     "0x0000000000000000000000b5be0484fb6118401f5377c32ec3f1e530cc181501"),
            new TokenResourceId("BUSD",     "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("SHIB",     "0x000000000000000000000049f1b81eca2b0d1e3aa82e64934292a6b59ad61b01"),
            new TokenResourceId("DAI",      "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",     "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("USDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("USDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }

        // const iterator = +(await DAO.getSetResourceRequestCount()) + 1;
        // console.info(iterator);

        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`SetResourceRequest ${i}`)    
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iterator; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);
        //     console.info(`adminSetResource ${i}`)    
        //     await Helpers.delay(4000);
        // }

        return true;
    });

task("set-resource-ids-polygon", "Setting resource Ids for tokens")      
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
        
        const tokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"), 
            new Token("WETH",   "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"), 
            new Token("BNB",    "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3"), 
            new Token("AVAX",   "0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b"), 
            new Token("BUSD",   "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7"), 
            new Token("MATIC",  "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"),
            new Token("FTM",    "0xC9c1c1c20B3658F8787CC2FD702267791f224Ce1"), 
            new Token("DAI",    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"),
            new Token("LINK",   "0xb0897686c545045aFc77CF20eC7A532E3120E0F1"), 
            new Token("USDT",   "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"),
            new Token("USDC",   "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"),
        ];

        const resourceIds = [
            //new TokenResourceId("wULX",   ""),
            new TokenResourceId("WBTC",     "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",     "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",      "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("AVAX",     "0x0000000000000000000000b5be0484fb6118401f5377c32ec3f1e530cc181501"),
            new TokenResourceId("BUSD",     "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("MATIC",    "0x0000000000000000000000cecc5727d1e5e4af94304ef98b559b00183cbeac01"),
            new TokenResourceId("FTM",      "0x0000000000000000000000df1c1c2f3305bb6e082d382a15eb9c048dc4c58a01"),
            new TokenResourceId("DAI",      "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",     "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("USDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("USDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }

        // const iterator = +(await DAO.getSetResourceRequestCount()) + 1;
        // console.info(iterator);
        
        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`SetResourceRequest ${i}`)    
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iterator; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);
        //     console.info(`adminSetResource ${i}`)    
        //     await Helpers.delay(4000);
        // }

        return true;
    });

task("set-resource-ids-ftm", "Setting resource Ids for tokens")      
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
        
        const tokenAddresses = [
            //new Token("wULX",   ""), 
            new Token("WBTC",   "0x321162Cd933E2Be498Cd2267a90534A804051b11"), 
            new Token("WETH",   "0x74b23882a30290451A17c44f4F05243b6b58C76d"), 
            new Token("BNB",    "0x27f26F00e1605903645BbaBC0a73E35027Dccd45"), 
            new Token("AVAX",   "0x511D35c52a3C244E7b8bd92c0C297755FbD89212"), 
            new Token("BUSD",   "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50"), 
            new Token("FTM",    "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"), 
            new Token("DAI",    "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E"),
            new Token("LINK",   "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8"), 
            new Token("USDT",   "0x049d68029688eabf473097a2fc38ef61633a3c7a"),
            new Token("USDC",   "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"),
        ];

        const resourceIds = [
            // new TokenResourceId("wULX",   ""),
            new TokenResourceId("WBTC",      "0x00000000000000000000008e96f8fcd6815b4e1528d63e5f72e6dcc04bf9be01"),
            new TokenResourceId("WETH",      "0x0000000000000000000000b15b478246201dac8d92353c34615a7b20bea93801"),
            new TokenResourceId("BNB",       "0x000000000000000000000093b400831fb4689e41457f43b3f697042fe59f0101"),
            new TokenResourceId("AVAX",      "0x0000000000000000000000b5be0484fb6118401f5377c32ec3f1e530cc181501"),
            new TokenResourceId("BUSD",      "0x0000000000000000000000422b105bb127a883f9dc0ee022304fcb5fde5b9c01"),
            new TokenResourceId("FTM",       "0x0000000000000000000000df1c1c2f3305bb6e082d382a15eb9c048dc4c58a01"),
            new TokenResourceId("DAI",       "0x0000000000000000000000312cf2901c89637f34a83f594028fba1517f8cd501"),
            new TokenResourceId("LINK",      "0x00000000000000000000004df449d10bd2bf419f2fe578dfd15bb361a2d14801"),
            new TokenResourceId("USDT",     "0x0000000000000000000000b7fe74c0c957534400d2ff0612d3f59af79eba4901"),
            new TokenResourceId("USDC",     "0x0000000000000000000000026d9a638b8981ed47aa1580f79533cea7c1fc4801"),
        ];

        const handler = await ethers.getContractAt("ERC20Handler", erc20HandlerAddress, signer);
        for(let i:number = 1; i <= tokenAddresses.length; i++) {
            let tokenAddress = await handler._resourceIDToTokenContractAddress(resourceIds[i - 1].resourceId); 
            console.info(`${tokenAddresses[i - 1].tokenName} - ${tokenAddress.toLowerCase() == tokenAddresses[i - 1].tokenAddress.toLowerCase()}`);
        }
        
        const iterator = +(await DAO.getSetResourceRequestCount()) + 1;
        console.info(iterator);
        
        // for(let i:number = 1; i <= tokenAddresses.length; i++) {
        //     await DAO.newSetResourceRequest(erc20HandlerAddress, resourceIds[i - 1].resourceId, tokenAddresses[i - 1].tokenAddress);
        //     console.info(`SetResourceRequest ${i}`)    
        //     await Helpers.delay(4000);
        // }

        // for(let i:number = iterator; i <= (await DAO.getSetResourceRequestCount()); i++) {
        //     await bridge.adminSetResource(i);
        //     console.info(`adminSetResource ${i}`)    
        //     await Helpers.delay(4000);
        // }

        return true;
    });
