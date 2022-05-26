import { ethers } from "hardhat";
import { Bridge, Bridge__factory, ERC20Handler__factory, DAO, DAO__factory } from "../../../typechain";
import * as dotenv from 'dotenv';
import * as Helpers from "../../../hardhat-test/helpers";
import { BigNumberish } from "ethers";
import hre from 'hardhat';

async function main() { 
  const colorReset = "\u001b[0m";
  const colorGreen = "\u001b[1;32m";
  const colorYellow = "\u001b[1;33m";
  const colorBlue = "\u001b[1;34m";
  
  dotenv.config();

  console.log(`${colorYellow}The Network is being installed...${colorReset}`);
  const networkName = hre.network.name;
  console.log(`Current Network Name: ${colorBlue}${networkName}${colorReset}`);
  const provider = ethers.providers.getDefaultProvider(networkName === "hardhat" ? undefined : networkName);
  console.log(`${colorGreen}The Network is installed successfully.${colorReset}`);

  console.log(`${colorYellow}The User Account is being initialized...${colorReset}`);
  const [signer, user1, user2, user3] = await ethers.getSigners();

  const domainId:BigNumberish = 1;
  const initialRealyers:string[] = [user1.address, user2.address, user3.address];
  const initialRelayerThreshold:BigNumberish = initialRealyers.length;
  const feeMaxValue:BigNumberish = 10000;
  const feePercent:BigNumberish = 10;
  const expiry:BigNumberish = 0;

  const tokenAddress = "0x853D98d7B260832A55F254bBcF51216fD3a13804";
  const destinationId:BigNumberish = 2;
  const basicFee = ethers.utils.parseUnits("0.1", 18);
  const minAmount = ethers.utils.parseUnits("1", 18);
  const maxAmount = ethers.utils.parseUnits("100000", 18);

  const DAOContract = await (await (new DAO__factory(signer)).deploy()).deployed() as DAO;
  
  console.log(`\nThe ${colorYellow}DAO${colorReset} address: ${colorBlue}${DAOContract.address}${colorReset}`);

  const BridgeContract = await (await (new Bridge__factory(signer))
        .deploy(domainId, initialRealyers, initialRelayerThreshold, expiry, feeMaxValue, feePercent)).deployed() as Bridge;

  console.log(`The ${colorYellow}Bridge${colorReset} address: ${colorBlue}${BridgeContract.address}${colorReset}`);

  await DAOContract.setBridgeContractInitial(BridgeContract.address);
  console.log(`\nSetted ${colorYellow}Bridge${colorReset} contract ${colorGreen}in DAO${colorReset}: ${colorBlue}${BridgeContract.address}${colorReset}`);
  await BridgeContract.setDAOContractInitial(DAOContract.address);
  console.log(`\nSetted ${colorYellow}DAO${colorReset} contract ${colorGreen}in Bridge${colorReset}: ${colorBlue}${DAOContract.address}${colorReset}`);

  await DAOContract.newChangeFeeRequest(tokenAddress, destinationId, basicFee, minAmount, maxAmount);
  await BridgeContract.adminChangeFee(1);

  const treasuryAddress = signer.address;
  const ERC20HandlerContract = await (await (new ERC20Handler__factory(signer)).deploy(BridgeContract.address, treasuryAddress)).deployed() as ERC20Handler;
  console.log(`\nThe ${colorYellow}ERC20Handler${colorReset} address: ${colorBlue}${ERC20HandlerContract.address}${colorReset}`);

  const resourceID = Helpers.createResourceID(tokenAddress, domainId);
  console.log(`\nThe ${colorYellow}ResourceID${colorReset}: ${colorBlue}${resourceID}${colorReset}`);
  await DAOContract.newSetResourceRequest(ERC20HandlerContract.address, resourceID, tokenAddress);
  await BridgeContract.adminSetResource(1);
  console.log(`\nSetted New Resource for token ${tokenAddress}`);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });