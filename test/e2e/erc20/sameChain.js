const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const Helpers = require('../../helpers');

const DAOContract = artifacts.require("DAO");
const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ERC20PresetMinterPauser");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('E2E ERC20 - Same Chain', async accounts => {
    const relayerThreshold = 2;
    const domainID = 1;

    const depositerAddress = accounts[1];
    const recipientAddress = accounts[2];
    const relayer1Address = accounts[3];
    const relayer2Address = accounts[4];

    const initialTokenAmount = Ethers.utils.parseUnits("100", 6);
    const depositAmount = Ethers.utils.parseUnits("20", 6);
    const expectedDepositNonce = 1;

    const feeMaxValue = 10000;
    const feePercent = 10;

    const basicFee = Ethers.utils.parseUnits("0.9", 6);
    const minAmount = Ethers.utils.parseUnits("10", 6);
    const maxAmount = Ethers.utils.parseUnits("1000000", 6);

    let DAOInstance;
    let BridgeInstance;
    let ERC20MintableInstance;
    let ERC20HandlerInstance;

    let resourceID;
    let depositData;
    let depositProposalData;
    let depositProposalDataHash;
    let initialResourceIDs;
    let initialContractAddresses;
    let burnableContractAddresses;

    beforeEach(async () => {
        await Promise.all([
            BridgeContract.new(domainID, [relayer1Address, relayer2Address], relayerThreshold, 100, feeMaxValue, feePercent).then(instance => BridgeInstance = instance),
            ERC20MintableContract.new("token", "TOK").then(instance => ERC20MintableInstance = instance)
        ]);

        DAOInstance = await DAOContract.new();
        await DAOInstance.setBridgeContractInitial(BridgeInstance.address);
        await BridgeInstance.setDAOContractInitial(DAOInstance.address);
        
        resourceID = Helpers.createResourceID(ERC20MintableInstance.address, domainID);
    
        initialResourceIDs = [resourceID];
        initialContractAddresses = [ERC20MintableInstance.address];
        burnableContractAddresses = [];

        ERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address);

        await ERC20MintableInstance.mint(depositerAddress, initialTokenAmount);
        await DAOInstance.newSetResourceRequest(ERC20HandlerInstance.address, resourceID, ERC20MintableInstance.address);
        await BridgeInstance.adminSetResource(1);
        
        await DAOInstance.newChangeFeeRequest(ERC20MintableInstance.address, domainID, basicFee, minAmount, maxAmount);
        await BridgeInstance.adminChangeFee(1);

        await ERC20MintableInstance.approve(ERC20HandlerInstance.address, depositAmount, { from: depositerAddress });

        depositData = Helpers.createERCDepositData(depositAmount.toNumber(), 20, recipientAddress);
        depositProposalData = Helpers.createERCDepositData(depositAmount.toNumber() - basicFee.toNumber(), 20, recipientAddress)
        depositProposalDataHash = Ethers.utils.keccak256(ERC20HandlerInstance.address + depositProposalData.substr(2));
    });

    it("[sanity] depositerAddress' balance should be equal to initialTokenAmount", async () => {
        const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), initialTokenAmount.toNumber());
    });

    it("[sanity] ERC20HandlerInstance.address should have an allowance of depositAmount from depositerAddress", async () => {
        const handlerAllowance = await ERC20MintableInstance.allowance(depositerAddress, ERC20HandlerInstance.address);
        assert.strictEqual(handlerAllowance.toNumber(), depositAmount.toNumber());
    });

    it("depositAmount of Destination ERC20 should be transferred to recipientAddress", async () => {
        // depositerAddress makes initial deposit of depositAmount
        await TruffleAssert.passes(BridgeInstance.deposit(
            domainID,
            resourceID,
            depositData,
            { from: depositerAddress }
        ));

        // Handler should have a balance of depositAmount
        const handlerBalance = await ERC20MintableInstance.balanceOf(ERC20HandlerInstance.address);
        assert.strictEqual(handlerBalance.toNumber(), depositAmount.toNumber() - basicFee.toNumber());
        
        // relayer1 creates the deposit proposal
        await TruffleAssert.passes(BridgeInstance.voteProposal(
            domainID,
            expectedDepositNonce,
            resourceID,
            depositProposalData,
            { from: relayer1Address }
        ));

        // relayer2 votes in favor of the deposit proposal
        // because the relayerThreshold is 2, the deposit proposal will go
        // into a finalized state
        // and then automatically executes the proposal
        await TruffleAssert.passes(BridgeInstance.voteProposal(
            domainID,
            expectedDepositNonce,
            resourceID,
            depositProposalData,
            { from: relayer2Address }
        ));

        // Assert ERC20 balance was transferred from depositerAddress
        const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), initialTokenAmount.toNumber() - depositAmount.toNumber());

        // // Assert ERC20 balance was transferred to recipientAddress
        const recipientBalance = await ERC20MintableInstance.balanceOf(recipientAddress);
        assert.strictEqual(recipientBalance.toNumber(), depositAmount.toNumber() - basicFee.toNumber());
    });
});
