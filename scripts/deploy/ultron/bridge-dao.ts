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
  let networkName: string = "ultron";
  console.log(`Current Network Name: ${colorBlue}${networkName}${colorReset}`);
  const provider = new ethers.providers.JsonRpcProvider("http://51.250.44.107:18545 ");
  console.log(`${colorGreen}The Network is installed successfully.${colorReset}`);

  console.log(`${colorYellow}The User Account is being initialized...${colorReset}`);
  const userPrivateKey: string = process.env.PRIVATE_KEY ?? "";

  const signer = new ethers.Wallet(userPrivateKey, provider);

  const DAOContract = await (await (new DAO__factory(signer)).deploy()).deployed() as DAO;
  
  console.log(`\nThe ${colorYellow}DAO${colorReset} address: ${colorBlue}${DAOContract.address}${colorReset}`);

  const domainId:BigNumberish = 1;
  const initialRealyers:string[] = [""];
  const initialRelayerThreshold:BigNumberish = initialRealyers.length;
  const fee:BigNumberish = 1;
  const expiry:BigNumberish = 1;

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