import { ethers } from "hardhat";
import { Multisig, Multisig__factory } from "../typechain";
import {expect} from "chai";
import { BigNumber, utils } from 'ethers';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import exp from "constants";

describe("Multisig test", () => {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    let provider: any;
    let accounts: SignerWithAddress[];

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

        multisig = await (await new Multisig__factory(owner).deploy()).deployed();
    });

    it("Insert initial voter", async () => {
        await multisig.connect(owner).insertInitialVoter();

        expect(await multisig.getActiveVotersCount()).equals(1);
    });

    it("Insert voter to voter list if not zero address and not already a voter", async () => {
        await multisig.connect(owner).newVoterRequest(true, newVoterFirst.address);
        await multisig.connect(owner).newVoterRequest(true, newVoterSecond.address);

        expect(await multisig.getVoterStatusByAddress(newVoterFirst.address)).equals(false);
        expect(await multisig.getVoterStatusByAddress(newVoterSecond.address)).equals(false);
    });

    it('Insert voters if enough votes', async () => {        
        await multisig.connect(owner).votersRequestConclusion(1);
       
        await multisig.connect(newVoterFirst).insertConfirmation(2);
        await multisig.connect(owner).votersRequestConclusion(2);
        
        await expect(multisig.connect(newVoterFirst).insertConfirmation(1)).revertedWith('already executed');
        await expect(multisig.connect(owner).votersRequestConclusion(2)).revertedWith('already executed');
        await expect(multisig.connect(owner).votersRequestConclusion(3)).revertedWith('not enough votes');
        await expect(multisig.connect(owner).newVoterRequest(true, newVoterFirst.address)).revertedWith('already a voter');
        await expect(multisig.connect(owner).newVoterRequest(true, zeroAddress)).revertedWith('zero address');
        await expect(multisig.connect(voterFirst).newVoterRequest(true, newVoterFirst.address)).revertedWith('not a voter');
        
        expect(await multisig.getActiveVotersCount()).equals(3);
    });

    it('Remove voter if enough votes', async () => {                
        await multisig.connect(owner).newVoterRequest(false, newVoterFirst.address);
        await multisig.connect(newVoterSecond).insertConfirmation(3);
        await multisig.connect(newVoterSecond).removeConfirmation(3);
        await multisig.connect(newVoterSecond).insertConfirmation(3);

        await multisig.connect(owner).votersRequestConclusion(3);
        
        await expect(multisig.connect(newVoterSecond).removeConfirmation(1)).revertedWith('already executed');
        await expect(multisig.connect(owner).votersRequestConclusion(3)).revertedWith('already executed');
        await expect(multisig.connect(owner).votersRequestConclusion(4)).revertedWith('not enough votes');
        await expect(multisig.connect(owner).newVoterRequest(false, newVoterFirst.address)).revertedWith('not a voter');
        await expect(multisig.connect(newVoterFirst).newVoterRequest(false, newVoterFirst.address)).revertedWith('not a voter');
        await expect(multisig.connect(owner).newVoterRequest(false, zeroAddress)).revertedWith('zero address');
        await expect(multisig.connect(voterFirst).newVoterRequest(false, newVoterFirst.address)).revertedWith('not a voter');

        expect(await multisig.getActiveVotersCount()).equals(2);
    });

    it('Replace voter if enough votes', async () => { 
        await multisig.connect(owner).replaceVoter(newVoterSecond.address, voterSecond.address);

        await expect(multisig.connect(owner).replaceVoter(voterFirst.address, newVoterSecond.address)).revertedWith('not a voter');
        await expect(multisig.connect(owner).replaceVoter(voterSecond.address, owner.address)).revertedWith('already a voter');

        expect(await multisig.getVoterStatusByAddress(newVoterSecond.address)).equals(false);
        expect(await multisig.getVoterStatusByAddress(voterSecond.address)).equals(true);
    });

})