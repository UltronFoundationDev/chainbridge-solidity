/**
 * Copyright 2021 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const DAOContract = artifacts.require("DAO");
const BridgeContract = artifacts.require("Bridge");
const ERC1155MintableContract = artifacts.require("ERC1155PresetMinterPauser");
const ERC1155HandlerContract = artifacts.require("ERC1155Handler");

contract('ERC1155Handler - [Burn ERC1155]', async () => {
    const relayerThreshold = 2;
    const domainID = 1;
    const feeMaxValue = 10000;
    const feePercent = 10;

    let DAOInstance;
    let BridgeInstance;
    let ERC1155MintableInstance1;
    let ERC1155MintableInstance2;
    let resourceID1;
    let resourceID2;
    let initialResourceIDs;
    let initialContractAddresses;
    let burnableContractAddresses;

    beforeEach(async () => {
        await Promise.all([
            BridgeContract.new(domainID, [], relayerThreshold, 100, feeMaxValue, feePercent).then(instance => BridgeInstance = instance),
            ERC1155MintableContract.new("TOK").then(instance => ERC1155MintableInstance1 = instance),
            ERC1155MintableContract.new("TOK").then(instance => ERC1155MintableInstance2 = instance)
        ]);

        DAOInstance = await DAOContract.new();
        await DAOInstance.setBridgeContractInitial(BridgeInstance.address);
        await BridgeInstance.setDAOContractInitial(DAOInstance.address);

        resourceID1 = Ethers.utils.hexZeroPad((ERC1155MintableInstance1.address + Ethers.utils.hexlify(domainID).substr(2)), 32);
        resourceID2 = Ethers.utils.hexZeroPad((ERC1155MintableInstance2.address + Ethers.utils.hexlify(domainID).substr(2)), 32);
        initialResourceIDs = [resourceID1, resourceID2];
        initialContractAddresses = [ERC1155MintableInstance1.address, ERC1155MintableInstance2.address];
        burnableContractAddresses = [ERC1155MintableInstance1.address]
    });

    it('[sanity] contract should be deployed successfully', async () => {
        await TruffleAssert.passes(ERC1155HandlerContract.new(BridgeInstance.address));
    });

    it('burnableContractAddresses should be marked true in _burnList', async () => {
        const ERC1155HandlerInstance = await ERC1155HandlerContract.new(BridgeInstance.address);
        
        for (i = 0; i < initialResourceIDs.length; i++) {
            await DAOInstance.newSetResourceRequest(ERC1155HandlerInstance.address, initialResourceIDs[i], initialContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetResource(i+1));
        }

        for (i = 0; i < burnableContractAddresses.length; i++) {
            await DAOInstance.newSetBurnableRequest(ERC1155HandlerInstance.address, burnableContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetBurnable(i+1));
        }
        
        for (const burnableAddress of burnableContractAddresses) {
            const isBurnable = await ERC1155HandlerInstance._burnList.call(burnableAddress);
            assert.isTrue(isBurnable, "Contract wasn't successfully marked burnable");
        }
    });

    it('ERC1155MintableInstance2.address should not be marked true in _burnList', async () => {
        const ERC1155HandlerInstance = await ERC1155HandlerContract.new(BridgeInstance.address);

        for (i = 0; i < initialResourceIDs.length; i++) {
            await DAOInstance.newSetResourceRequest(ERC1155HandlerInstance.address, initialResourceIDs[i], initialContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetResource(i+1));
        }

        for (i = 0; i < burnableContractAddresses.length; i++) {
            await DAOInstance.newSetBurnableRequest(ERC1155HandlerInstance.address, burnableContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetBurnable(i+1));
        }

        const isBurnable = await ERC1155HandlerInstance._burnList.call(ERC1155MintableInstance2.address);
        assert.isFalse(isBurnable, "Contract shouldn't be marked burnable");
    });

    it('ERC1155MintableInstance2.address should be marked true in _burnList after setBurnable is called', async () => {
        const ERC1155HandlerInstance = await ERC1155HandlerContract.new(BridgeInstance.address);

        for (i = 0; i < initialResourceIDs.length; i++) {
            await DAOInstance.newSetResourceRequest(ERC1155HandlerInstance.address, initialResourceIDs[i], initialContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetResource(i+1));
        }

        for (i = 0; i < burnableContractAddresses.length; i++) {
            await DAOInstance.newSetBurnableRequest(ERC1155HandlerInstance.address, burnableContractAddresses[i]);
            await TruffleAssert.passes(BridgeInstance.adminSetBurnable(i+1));
        }
        
        await DAOInstance.newSetBurnableRequest(ERC1155HandlerInstance.address, ERC1155MintableInstance2.address);
        await BridgeInstance.adminSetBurnable(burnableContractAddresses.length + 1);
        const isBurnable = await ERC1155HandlerInstance._burnList.call(ERC1155MintableInstance2.address);
        assert.isTrue(isBurnable, "Contract wasn't successfully marked burnable");
    });
});