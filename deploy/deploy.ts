import { BigNumberish } from "ethers";
import { subtask, task } from "hardhat/config";
import * as Helpers from "../hardhat-test/helpers";

task("deploy", "deploy everything")
    .setAction(async (_, { run, ethers, network }) => {
        const signer = (await ethers.getSigners())[0];

        const bridge = await run("bridge", {signer: signer});
        const ERC20Handler = await run("ERC20Handler", { signer: signer, bridge: bridge });
        const DAOContract = await run("crimeGoldStaking", { signer: signer, bridge: bridge, ERC20Handler: ERC20Handler });
        
        const setInitialContracts = await run("setInitialContracts", {
            signer: signer, bridge: bridge, ERC20Handler: ERC20Handler, DAO: DAOContract
        });

        const changeFee = await run("changeFee", {
            signer: signer, bridge: bridge, ERC20Handler: ERC20Handler, DAO: DAOContract
        });

        console.log("=".repeat(50));
        Helpers.logDeploy("bridge", "Impl", bridge);
        Helpers.logDeploy("ERC20Handler", "Proxy", ERC20Handler);
        Helpers.logDeploy("DAOContract", "Impl", DAOContract);
        console.log("Set initial contracts: " + setInitialContracts);
        console.log("Change fee: " + changeFee);
    });


/*========== BRidge ==========*/
subtask("bridge", "The contract Bridge is deployed")
    .addParam("signer", "signer address")
    .setAction(async (taskArgs, { ethers }) => {
        const domainId:BigNumberish = 1;
        const initialRealyers:string[] = [`${taskArgs.signer.address}`];
        const initialRelayerThreshold:BigNumberish = initialRealyers.length;
        const expiry:BigNumberish = 40;
        const feeMaxValue:BigNumberish = 10000;
        const feePercent:BigNumberish = 10;

        const bridgeFactory = await ethers.getContractFactory("Bridge", taskArgs.signer);
        const bridge = await (await bridgeFactory.deploy(domainId, initialRealyers, initialRelayerThreshold, expiry, feeMaxValue, feePercent)).deployed();
        console.log("The Bridge address: " + "\u001b[1;34m" + bridge.address + "\u001b[0m");
        
        return bridge.address;
    });

/*========== ERC20Handler ==========*/
subtask("ERC20Handler", "The contract ERC20Handler is deployed")
    .addParam("signer", "signer address")    
    .addParam("bridge", "bridge address")
    .setAction(async (taskArgs, { ethers }) => {
        const treasuryAddress = taskArgs.signer.address;
        
        const ERC20HandlerFactory = await ethers.getContractFactory("ERC20Handler", taskArgs.signer);
        const ERC20Handler = await (await ERC20HandlerFactory.deploy(taskArgs.bridge, treasuryAddress)).deployed();
        console.log("The ERC20Handler address: " + "\u001b[1;34m" + ERC20Handler.address + "\u001b[0m");
        
        return ERC20Handler.address;
    });

/*========== DAO ==========*/
subtask("DAO", "The contract DAO is deployed")
    .addParam("signer", "signer address")        
    .addParam("bridge", "bridge address")
    .addParam("ERC20Handler", "ERC20Handler address")
    .setAction(async (taskArgs, { ethers }) => {
        const DAOFactory = await ethers.getContractFactory("DAO", taskArgs.signer);
        const DAO = await (await DAOFactory.deploy(taskArgs.bridge, taskArgs.ERC20Handler)).deployed();
        console.log("The DAO address: " + "\u001b[1;34m" + DAO.address + "\u001b[0m");
        return DAO.address;
    });

/*========== Set DAO Contracts ==========*/
subtask("setInitialContracts", "Set Initial Contracts successfully")
    .addParam("signer", "signer address")        
    .addParam("bridge", "bridge address")
    .addParam("ERC20Handler", "ERC20Handler address")
    .addParam("DAO", "DAO address")
    .setAction(async (taskArgs, { ethers }) => {
        const bridge = await ethers.getContractAt("bridge", taskArgs.bridge, taskArgs.signer);
        const ERC20Handler = await ethers.getContractAt("ERC20Handler", taskArgs.ERC20Handler, taskArgs.signer);

        const setInitialContracts = await Promise.all([            
            bridge.setDAOContractInitial(taskArgs.DAO),
            ERC20Handler.setDAOContractInitial(taskArgs.DAO)
        ]); 

        return setInitialContracts
    });

/*========== Change FEE ==========*/
subtask("changeFee", "The contract AssetManager is deployed")
    .addParam("signer", "signer address")        
    .addParam("bridge", "bridge address")
    .addParam("ERC20Handler", "ERC20Handler address")
    .addParam("DAO", "DAO address")
    .setAction(async (taskArgs, { ethers }) => {
        const bridge = await ethers.getContractAt("bridge", taskArgs.bridge, taskArgs.signer);
        const DAO = await ethers.getContractAt("DAO", taskArgs.DAO, taskArgs.signer);

        const tokenAddress = "0xb0549050f6337DFF95cDb09352e7DA7a916794F1";
        const destTokenAddress = "0x853D98d7B260832A55F254bBcF51216fD3a13804";
        const domainId:BigNumberish = 1;
        const destinationId:BigNumberish = 2;
        const basicFee = ethers.utils.parseUnits("0.1", 18);
        const minAmount = ethers.utils.parseUnits("1", 18);
        const maxAmount = ethers.utils.parseUnits("100000", 18);

        const resourceID = Helpers.createResourceID('0x853D98d7B260832A55F254bBcF51216fD3a13804', 1);

        await DAO.newChangeFeeRequest(tokenAddress, destinationId, basicFee, minAmount, maxAmount);
        await bridge.adminChangeFee( (await DAO.getChangeFeeRequestCount())  + 1);
        console.log(`\nSet New Fee for token ${tokenAddress} on destination chain ${destinationId}`);
        await DAO.newChangeFeeRequest(tokenAddress, domainId, basicFee, minAmount, maxAmount);
        await bridge.adminChangeFee( (await DAO.getChangeFeeRequestCount()) + 1);
        console.log(`\nSet New Fee for dest token ${tokenAddress} on domain chain ${domainId}`);
        
        // Should copy it from console, when deploys to another chain
        await DAO.newSetResourceRequest(taskArgs.ERC20Handler, resourceID, tokenAddress);
        await bridge.adminSetResource((await DAO.getSetResourceRequestCount()) + 1);
        console.log(`\nSet New Resource for token ${tokenAddress}`);
      
    });