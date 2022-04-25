import { ethers } from "hardhat";
import { Bridge, Bridge__factory, DAO, DAO__factory } from "../../../typechain";
import * as dotenv from 'dotenv';
import { BigNumberish } from "ethers";

async function main() { 
  const colorReset = "\u001b[0m";
  const colorGreen = "\u001b[1;32m";
  const colorYellow = "\u001b[1;33m";
  const colorBlue = "\u001b[1;34m";
  
  dotenv.config();

  console.log(`${colorYellow}The Network is being installed...${colorReset}`);
  const networkName: string = "hardhat";
  console.log(`Current Network Name: ${colorBlue}${networkName}${colorReset}`);
  const provider = ethers.providers.getDefaultProvider(networkName === "hardhat" ? undefined : networkName);
  console.log(`${colorGreen}The Network is installed successfully.${colorReset}`);

  console.log(`${colorYellow}The User Account is being initialized...${colorReset}`);
  const [signer, user1, user2, user3] = await ethers.getSigners();

  const DAOContract = await (await (new DAO__factory(signer)).deploy()).deployed() as DAO;
  
  console.log(`\nThe ${colorYellow}DAO${colorReset} address: ${colorBlue}${DAOContract.address}${colorReset}`);

  const domainId:BigNumberish = 1;
  const initialRealyers:string[] = [user1.address, user2.address, user3.address];
  const initialRelayerThreshold:BigNumberish = initialRealyers.length;
  const fee:BigNumberish = 100;
  const expiry:BigNumberish = 0;

  const BridgeContract = await (await (new Bridge__factory(signer))
        .deploy(domainId, initialRealyers, initialRelayerThreshold, fee, expiry)).deployed() as Bridge;

  console.log(`The ${colorYellow}Bridge${colorReset} address: ${colorBlue}${BridgeContract.address}${colorReset}`);

  await DAOContract.setBridgeContractInitial(BridgeContract.address);
  console.log(`\nSetted ${colorYellow}Bridge${colorReset} contract ${colorGreen}in DAO${colorReset}: ${colorBlue}${BridgeContract.address}${colorReset}`);
  await BridgeContract.setDAOContractInitial(DAOContract.address);
  console.log(`\nSetted ${colorYellow}DAO${colorReset} contract ${colorGreen}in Bridge${colorReset}: ${colorBlue}${DAOContract.address}${colorReset}`);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });