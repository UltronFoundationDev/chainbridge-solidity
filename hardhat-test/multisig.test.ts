import { ethers } from "hardhat";
import { Multisig, Multisig__factory } from "../typechain";
import {expect} from "chai";
import { BigNumber, utils } from 'ethers';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Multisig test", () => {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    let provider: any;
    let accounts: SignerWithAddress[];
    let newVoters: string[];

    let owner: SignerWithAddress;
    let voterFirst: SignerWithAddress;
    let voterSecond: SignerWithAddress;
    let newVoterFirst: SignerWithAddress;
    let newVoterSecond: SignerWithAddress;

    let multisig: Multisig;

    before(async () => {
        provider = ethers.provider;
        accounts = await ethers.getSigners();
        [ owner, voterFirst, voterSecond, newVoterFirst, newVoterSecond ] = await ethers.getSigners();
        newVoters = [ newVoterFirst.address, newVoterSecond.address ];

        multisig = await (await new Multisig__factory(owner).deploy()).deployed();

        // multisig.connect(owner).insertInitialVoter();
    });

    it("Inserts initial voter", async () => {
        await multisig.connect(owner).insertInitialVoter();

        expect(await multisig.getActiveVotersCount()).equals(1);
    });

    it("Inserts voter to voter list if not zero address and not already a voter", async () => {
        await multisig.connect(owner).insertVoterRequest(newVoters);

        expect(await multisig.getVoterStatusByAddress(newVoters[0])).equals(false);
        expect(await multisig.getVoterStatusByAddress(newVoters[1])).equals(false);
    });
})