const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const Helpers = require('../../helpers');

const DAOContract = artifacts.require("DAO");
const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ERC20PresetMinterPauser");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('E2E ERC20 - Two EVM Chains', async accounts => {
    const originRelayerThreshold = 2;
    const originDomainID = 1;
    const originRelayer1Address = accounts[3];
    const originRelayer2Address = accounts[4];
    
    const destinationRelayerThreshold = 2;
    const destinationDomainID = 2;
    const destinationRelayer1Address = accounts[3];
    const destinationRelayer2Address = accounts[4];
    
    const depositerAddress = accounts[1];
    const recipientAddress = accounts[2];

    const initialTokenAmount = Ethers.utils.parseUnits("100", 6);;
    const depositAmount = Ethers.utils.parseUnits("20", 6);
    const expectedDepositNonce = 1;
    const feeMaxValue = 10000;
    const feePercent = 10;

    const someAddressOrigin = "0xcafecafecafecafecafecafecafecafecafecafe";
    const someAddressDestination = "0xcafecafecafecafecafecafecafecafecafeca11";

    const basicFee = Ethers.utils.parseUnits("0.9", 6);
    const minAmount = Ethers.utils.parseUnits("10", 6);
    const maxAmount = Ethers.utils.parseUnits("1000000", 6);
    
    let OrininDAOInstance;
    let OriginBridgeInstance;
    let OriginERC20MintableInstance;
    let OriginERC20HandlerInstance;
    let originDepositData;
    let originDepositProposalData;
    let originDepositProposalDataHash;
    let originResourceID;
    let originInitialResourceIDs;
    let originInitialContractAddresses;
    let originBurnableContractAddresses;
    
    let DestinationDAOInstance;
    let DestinationBridgeInstance;
    let DestinationERC20MintableInstance;
    let DestinationERC20HandlerInstance;
    let destinationDepositData;
    let destinationDepositProposalData;
    let destinationDepositProposalDataHash;
    let destinationResourceID;
    let destinationInitialResourceIDs;
    let destinationInitialContractAddresses;
    let destinationBurnableContractAddresses;

    beforeEach(async () => {
        await Promise.all([
            BridgeContract.new(originDomainID, [originRelayer1Address, originRelayer2Address], originRelayerThreshold, 100, feeMaxValue, feePercent).then(instance => OriginBridgeInstance = instance),
            BridgeContract.new(destinationDomainID, [destinationRelayer1Address, destinationRelayer2Address], destinationRelayerThreshold, 100, feeMaxValue, feePercent).then(instance => DestinationBridgeInstance = instance),
            ERC20MintableContract.new("token", "TOK").then(instance => OriginERC20MintableInstance = instance),
            ERC20MintableContract.new("token", "TOK").then(instance => DestinationERC20MintableInstance = instance)
        ]);

        OriginDAOInstance = await DAOContract.new(OriginBridgeInstance.address, someAddressOrigin);
        await OriginBridgeInstance.setDAOContractInitial(OriginDAOInstance.address);

        DestinationDAOInstance = await DAOContract.new(DestinationBridgeInstance.address, someAddressDestination);
        await DestinationBridgeInstance.setDAOContractInitial(DestinationDAOInstance.address);

        originResourceID = Helpers.createResourceID(OriginERC20MintableInstance.address, originDomainID);
        originInitialResourceIDs = [originResourceID];
        originInitialContractAddresses = [OriginERC20MintableInstance.address];
        originBurnableContractAddresses = [OriginERC20MintableInstance.address];

        destinationResourceID = Helpers.createResourceID(DestinationERC20MintableInstance.address, originDomainID);
        destinationInitialResourceIDs = [destinationResourceID];
        destinationInitialContractAddresses = [DestinationERC20MintableInstance.address];
        destinationBurnableContractAddresses = [DestinationERC20MintableInstance.address];

        await Promise.all([
            ERC20HandlerContract.new(OriginBridgeInstance.address, someAddressOrigin)
                .then(instance => OriginERC20HandlerInstance = instance),
            ERC20HandlerContract.new(DestinationBridgeInstance.address, someAddressDestination)
                .then(instance => DestinationERC20HandlerInstance = instance),
        ]);

        await OriginERC20HandlerInstance.setDAOContractInitial(OriginDAOInstance.address);
        await DestinationERC20HandlerInstance.setDAOContractInitial(DestinationDAOInstance.address);

        await OriginERC20MintableInstance.mint(depositerAddress, initialTokenAmount);

        await OriginERC20MintableInstance.approve(OriginERC20HandlerInstance.address, depositAmount, { from: depositerAddress }),
        await OriginERC20MintableInstance.grantRole(await OriginERC20MintableInstance.MINTER_ROLE(), OriginERC20HandlerInstance.address),
        await DestinationERC20MintableInstance.grantRole(await DestinationERC20MintableInstance.MINTER_ROLE(), DestinationERC20HandlerInstance.address),
        
        await OriginDAOInstance.newSetResourceRequest(OriginERC20HandlerInstance.address, originResourceID, OriginERC20MintableInstance.address);
        await OriginDAOInstance.newSetBurnableRequest(OriginERC20HandlerInstance.address, originBurnableContractAddresses[0]);
        await OriginBridgeInstance.adminSetResource(1),
        await OriginBridgeInstance.adminSetBurnable(1),

        await OriginDAOInstance.newChangeFeeRequest(OriginERC20MintableInstance.address, destinationDomainID, basicFee, minAmount, maxAmount);
        await OriginBridgeInstance.adminChangeFee(1);
        
        await DestinationDAOInstance.newSetResourceRequest(DestinationERC20HandlerInstance.address, destinationResourceID, DestinationERC20MintableInstance.address);
        await DestinationDAOInstance.newSetBurnableRequest(DestinationERC20HandlerInstance.address, destinationBurnableContractAddresses[0]);
        await DestinationBridgeInstance.adminSetResource(1);
        await DestinationBridgeInstance.adminSetBurnable(1);

        await DestinationDAOInstance.newChangeFeeRequest(DestinationERC20MintableInstance.address, originDomainID, basicFee, minAmount, maxAmount);
        await DestinationBridgeInstance.adminChangeFee(1);

        originDepositData = Helpers.createERCDepositData(depositAmount.toNumber(), 20, recipientAddress);
        originDepositProposalData = Helpers.createERCDepositData(depositAmount.toNumber(), 20, recipientAddress);
        originDepositProposalDataHash = Ethers.utils.keccak256(DestinationERC20HandlerInstance.address + originDepositProposalData.substr(2));
        
        destinationDepositData = Helpers.createERCDepositData(depositAmount.toNumber(), 20, depositerAddress);
        destinationDepositProposalData = Helpers.createERCDepositData(depositAmount.toNumber() - basicFee.toNumber(), 20, depositerAddress);
        destinationDepositProposalDataHash = Ethers.utils.keccak256(OriginERC20HandlerInstance.address + destinationDepositProposalData.substr(2));
    });
    
    it("[sanity] depositerAddress' balance should be equal to initialTokenAmount", async () => {
        const depositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), initialTokenAmount.toNumber());
    });

    it("[sanity] OriginERC20HandlerInstance.address should have an allowance of depositAmount from depositerAddress", async () => {
        const handlerAllowance = await OriginERC20MintableInstance.allowance(depositerAddress, OriginERC20HandlerInstance.address);
        assert.strictEqual(handlerAllowance.toNumber(), depositAmount.toNumber());
    });

    it("[sanity] DestinationERC20HandlerInstance.address should have minterRole for DestinationERC20MintableInstance", async () => {
        const isMinter = await DestinationERC20MintableInstance.hasRole(await DestinationERC20MintableInstance.MINTER_ROLE(), DestinationERC20HandlerInstance.address);
        assert.isTrue(isMinter);
    });

    it("E2E: depositAmount of Origin ERC20 owned by depositAddress to Destination ERC20 owned by recipientAddress and back again", async () => {
        let depositerBalance;
        let recipientBalance;

        // depositerAddress makes initial deposit of depositAmount
        await TruffleAssert.passes(OriginBridgeInstance.deposit(
            destinationDomainID,
            originResourceID,
            originDepositData,
            { from: depositerAddress }
        ));

        // destinationRelayer1 creates the deposit proposal
        await TruffleAssert.passes(DestinationBridgeInstance.voteProposal(
            originDomainID,
            destinationDomainID,
            expectedDepositNonce,
            destinationResourceID,
            originDepositProposalData,
            { from: destinationRelayer1Address }
        ));


        // destinationRelayer2 votes in favor of the deposit proposal
        // because the destinationRelayerThreshold is 2, the deposit proposal will go
        // into a finalized state
        // And then automatically executes the proposal.
        await TruffleAssert.passes(DestinationBridgeInstance.voteProposal(
            originDomainID,
            destinationDomainID,
            expectedDepositNonce,
            destinationResourceID,
            originDepositProposalData,
            { from: destinationRelayer2Address }
        ));

        // Assert ERC20 balance was transferred from depositerAddress
        depositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), initialTokenAmount.toNumber() - depositAmount.toNumber(), "depositAmount wasn't transferred from depositerAddress");

        // Assert ERC20 balance was transferred to recipientAddress
        recipientBalance = await DestinationERC20MintableInstance.balanceOf(recipientAddress);
        assert.strictEqual(recipientBalance.toNumber(), depositAmount.toNumber() - basicFee.toNumber(), "depositAmount wasn't transferred to recipientAddress");

        // At this point a representation of OriginERC20Mintable has been transferred from
        // depositer to the recipient using Both Bridges and DestinationERC20Mintable.
        // Next we will transfer DestinationERC20Mintable back to the depositer
        await DestinationERC20MintableInstance.approve(DestinationERC20HandlerInstance.address, depositAmount, { from: recipientAddress });
        
        // recipientAddress makes a deposit of the received depositAmount
        await TruffleAssert.passes(DestinationBridgeInstance.deposit(
            originDomainID,
            destinationResourceID,
            destinationDepositProposalData,
            { from: recipientAddress }
        ));

        // Recipient should have a balance of 0 (deposit amount - deposit amount)
        recipientBalance = await DestinationERC20MintableInstance.balanceOf(recipientAddress);
        assert.strictEqual(recipientBalance.toNumber(), 0);

        // destinationRelayer1 creates the deposit proposal
        await TruffleAssert.passes(OriginBridgeInstance.voteProposal(
            destinationDomainID,
            originDomainID,
            expectedDepositNonce,
            originResourceID,
            destinationDepositProposalData,
            { from: originRelayer1Address }
        ));

        // destinationRelayer2 votes in favor of the deposit proposal
        // because the destinationRelayerThreshold is 2, the deposit proposal will go
        // into a finalized state
        // and then automatically executes the proposal
        await TruffleAssert.passes(OriginBridgeInstance.voteProposal(
            destinationDomainID,
            originDomainID,
            expectedDepositNonce,
            originResourceID,
            destinationDepositProposalData,
            { from: originRelayer2Address }
        ));

        // Assert ERC20 balance was transferred from recipientAddress
        recipientBalance = await DestinationERC20MintableInstance.balanceOf(recipientAddress);
        assert.strictEqual(recipientBalance.toNumber(), 0);
        
        // Assert ERC20 balance was transferred to recipientAddress
        depositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), initialTokenAmount.toNumber() - (basicFee.toNumber() * 2));
    });
});
