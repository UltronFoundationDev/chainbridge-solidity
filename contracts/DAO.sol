pragma solidity 0.8.11;

import "./interfaces/IDAO.sol";
import "./utils/Multisig.sol";
import "hardhat/console.sol";

/// @notice DAO contract, which provides owner changing
contract DAO is Multisig, IDAO {
    enum RequestType {
        OwnerChange,
        Transfer,
        PauseStatus,
        RelayerThreshold,
        SetResource,
        SetGenericResource,
        SetBurnable,
        SetNonce,
        SetForwarder,
        ChangeFee,
        Withdraw
    }

    event NewVoteForRequest(RequestType indexed requestType, bool voteType, address indexed sender, uint256 indexed requestId);

    struct OwnerChangeRequest {
        address newOwner;
        bool status;
    }

    struct TransferRequest {
        address payable[] addresses;
        uint[] amounts;
        bool status;
    }

    struct ChangeRelayerThresholdRequest {
        uint256 amount;
        bool status;
    }

    struct SetResourceRequest {
        address handlerAddress; 
        bytes32 resourceId; 
        address tokenAddress;
        bool status;
    }

    struct SetGenericResourceRequest {
        address handlerAddress;
        bytes32 resourceId;
        address contractAddress;
        bytes4 depositFunctionSig;
        uint256 depositFunctionDepositerOffset;
        bytes4 executeFunctionSig;
        bool status;
    }

    struct SetBurnableRequest {
        address handlerAddress; 
        address tokenAddress;
        bool status;
    }

    struct SetNonceRequest {
        uint8 domainId; 
        uint64 nonce;
        bool status;
    }

    struct SetForwarderRequest {
        address forwarder;
        bool valid;
        bool status;
    }

    /// @notice Mode means the desiring status of contract(true for pause, false for unpause)
    struct PauseStatusRequest {
        bool mode;
        bool status;
    }

    struct ChangeFeeRequest {
        uint256 amount;
        bool status;
    }

    struct WithdrawRequest {
        address handlerAddress;
        bytes data;
        bool status;
    }

    // mapping of owner change requests
    mapping(uint256 => OwnerChangeRequest) private ownerChangeRequests;
    // mapping of owner change request confirmations
    mapping(uint256 => mapping(address => bool)) private ownerChangesRequestConfirmations;
    // id for new owner change request
    uint256 private ownerChangeRequestCounter;

    // mapping of transfer requests
    mapping(uint256 => TransferRequest) private transferRequests;
    // mapping of signs of transfer requests
    mapping(uint256 => mapping(address => bool)) private transferRequestConfirmations;
    // id for new transfer request
    uint256 private transferRequestCounter;

    // mapping of pause requests
    mapping(uint256 => PauseStatusRequest) private pauseStatusRequests;
    // mapping of pause request confirmations
    mapping(uint256 => mapping(address => bool)) private pauseStatusRequestConfirmations;
    // id for new pause request
    uint256 private pauseStatusRequestCounter;

    // mapping of change relayer threshold requests
    mapping(uint256 => ChangeRelayerThresholdRequest) private changeRelayerThresholdRequests;
    // mapping of change relayer threshold request confirmations
    mapping(uint256 => mapping(address => bool)) private changeRelayerThresholdRequestConfirmations;
    // id for new change relayer threshold request
    uint256 private changeRelayerThresholdRequestCounter;

    // mapping of set resource requests
    mapping(uint256 => SetResourceRequest) private setResourceRequests;
    // mapping of set resource request confirmations
    mapping(uint256 => mapping(address => bool)) private setResourceRequestConfirmations;
    // id for new set resource request
    uint256 private setResourceRequestCounter;

    // mapping of set generic resource requests
    mapping(uint256 => SetGenericResourceRequest) private setGenericResourceRequests;
    // mapping of set generic resource request confirmations
    mapping(uint256 => mapping(address => bool)) private setGenericResourceRequestConfirmations;
    // id for new set generic resource request
    uint256 private setGenericResourceRequestCounter;

    // mapping of set burnable requests
    mapping(uint256 => SetBurnableRequest) private setBurnableRequests;
    // mapping of set burnable request confirmations
    mapping(uint256 => mapping(address => bool)) private setBurnableRequestConfirmations;
    // id for new set burnable request
    uint256 private setBurnableRequestCounter;

    // mapping of set nonce requests
    mapping(uint256 => SetNonceRequest) private setNonceRequests;
    // mapping of set nonce request confirmations
    mapping(uint256 => mapping(address => bool)) private setNonceRequestConfirmations;
    // id for new set nonce request
    uint256 private setNonceRequestCounter;

    // mapping of set forwarder requests
    mapping(uint256 => SetForwarderRequest) private setForwarderRequests;
    // mapping of set forwarder request confirmations
    mapping(uint256 => mapping(address => bool)) private setForwarderRequestConfirmations;
    // id for new set forwarder request
    uint256 private setForwarderRequestCounter;

    // mapping of change fee requests
    mapping(uint256 => ChangeFeeRequest) private changeFeeRequests;
    // mapping of change fee confirmations
    mapping(uint256 => mapping(address => bool)) private changeFeeRequestConfirmations;
    // id for new change fee request
    uint256 private changeFeeRequestCounter;

    // mapping of withdraw requests
    mapping(uint256 => WithdrawRequest) private withdrawRequests;
    // mapping of withdraw confirmations
    mapping(uint256 => mapping(address => bool)) private withdrawRequestConfirmations;
    // id for new withdraw request
    uint256 private withdrawRequestCounter;

    address private bridgeContract;

    /**
     * @notice Throws error if any contract except bridge trys to call the function
    */
    modifier onlyBridge() {
        require(bridgeContract == msg.sender, "not bridge address");
        _;
    }

    /**
     * @notice Throws error if any contract except bridge trys to call the function
    */
    function setBridgeContractInitial(address _address) external {
        require(bridgeContract == address(0), "already set");
        require(_address != address(0), "zero address");
        bridgeContract = _address;
    }

    /**
     * @notice Allows changing owner request if it is not approved 
     * and there are enough votes
     * @param id the id of change owner request
    */
    function isOwnerChangeAvailable(uint256 id) 
        external 
        view 
        override
        returns (address)
    {
        require(!ownerChangeRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(ownerChangesRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");

        return ownerChangeRequests[id].newOwner;
    }

    /**
     * @notice Approves changing owner request if it is not approved
     * @param id the id of owner change request
    */
    function confirmOwnerChangeRequest(uint256 id) 
        external 
        override
        onlyBridge
        returns (bool)
    {
        require(!ownerChangeRequests[id].status, "already approved");
        ownerChangeRequests[id].status = true;
        return true;
    }

    /**
     * @notice Allows a voter to insert a confirmation for owner change request 
     * if it is not approved and not confirmed
     * @param voteType the vote type: true/false = insert/remove vote
     * @param id the id of owner change request
    */
    function newVoteForOwnerChangeRequest(bool voteType, uint256 id) 
        external 
        onlyVoter(msg.sender)
    {
        require(!ownerChangeRequests[id].status, "already approved");
        if(voteType) {
            require(!ownerChangesRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(ownerChangesRequestConfirmations[id][msg.sender], "not confirmed");
        }
        ownerChangesRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.OwnerChange, voteType, msg.sender, id);
    }

    /**
     * @notice Creation of change owner request by any voter
     * @param _address new owner address
    */
    function newOwnerChangeRequest(address _address)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(_address!= address(0), "zero address");
        ownerChangeRequestCounter = ownerChangeRequestCounter + 1;
        
        ownerChangeRequests[ownerChangeRequestCounter] = OwnerChangeRequest({
            newOwner: _address,
            status: false
        });
        
        ownerChangesRequestConfirmations[ownerChangeRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.OwnerChange, true, msg.sender, ownerChangeRequestCounter);
        return ownerChangeRequestCounter;
    }

    /**
     * @notice Allows transfer request if it is not approved 
     * and there are enough votes
     * @param id the id of transfer request
    */
    function isTransferAvailable(uint256 id)
        external
        view
        override
        returns (address payable[] memory, uint[] memory)
    {
        require(!transferRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;

        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(transferRequestConfirmations[id][getVoterById(i)]
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");

        return (transferRequests[id].addresses, transferRequests[id].amounts);
    }

    /**
     * @notice Approves transfer request if it is not approved
     * @param id the id of transfer request
    */
    function confirmTransferRequest(uint256 id)
        external
        override
        onlyBridge
        returns (bool)
    {
        require(!transferRequests[id].status, "already approved");
        transferRequests[id].status = true;
        return true;
    }

    /**
     * @notice Allows a voter to insert a confirmation for transfer request 
     * if it is not approved and not confirmed
     * @param voteType the vote type: true/false = insert/remove vote
     * @param id the id of transfer request
    */
    function newVoteForTransferRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!transferRequests[id].status, "already approved");
        if(voteType) {
            require(!transferRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(transferRequestConfirmations[id][msg.sender], "not confirmed");
        }
        transferRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.Transfer, voteType, msg.sender, id);
    }

    /**
     * @notice Creation of transfer request by any voter
    */
    function newTransferRequest(address payable[] calldata addresses, uint[] calldata amounts)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        transferRequestCounter = transferRequestCounter + 1;
        transferRequests[transferRequestCounter] = TransferRequest({
            addresses: addresses,
            amounts: amounts,
            status: false
        });

        transferRequestConfirmations[transferRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.Transfer, true, msg.sender, transferRequestCounter);

        return transferRequestCounter;
    }

    function isPauseStatusAvailable(uint256 id)
        external
        view
        override
        returns (bool)
    {
        require(!pauseStatusRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;

        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(pauseStatusRequestConfirmations[id][getVoterById(i)]
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return pauseStatusRequests[id].mode;
    }

    function confirmPauseStatusRequest(uint256 id)
        external
        onlyBridge
        override
        returns (bool) 
    {
        require(!pauseStatusRequests[id].status, "already approved");
        pauseStatusRequests[id].status = true;
        return true;
    }

    function newVoteForPauseStatusRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!pauseStatusRequests[id].status, "already approved");
        if(voteType) {
            require(!pauseStatusRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(pauseStatusRequestConfirmations[id][msg.sender], "not confirmed");
        }
        pauseStatusRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.PauseStatus, voteType, msg.sender, id);
    }

    function newPauseStatusRequest(bool mode)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        pauseStatusRequestCounter = pauseStatusRequestCounter + 1;   
        pauseStatusRequests[pauseStatusRequestCounter] = PauseStatusRequest({
            mode: mode,
            status: false
        });

        pauseStatusRequestConfirmations[pauseStatusRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.PauseStatus, true, msg.sender, pauseStatusRequestCounter);

        return pauseStatusRequestCounter;
    }

    function isChangeRelayerThresholdAvailable(uint256 id) 
        external 
        view 
        override
        returns (uint256) 
    {
        require(!changeRelayerThresholdRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;

        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(changeRelayerThresholdRequestConfirmations[id][getVoterById(i)]
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");

        return changeRelayerThresholdRequests[id].amount;
    }

    function confirmChangeRelayerThresholdRequest(uint256 id) 
        external
        override
        onlyBridge
        returns (bool)
    {
        require(!changeRelayerThresholdRequests[id].status, "already approved");
        changeRelayerThresholdRequests[id].status = true;
        return true;
    }

    function newVoteForChangeRelayerThresholdRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!changeRelayerThresholdRequests[id].status, "already approved");
        if(voteType) {
            require(!changeRelayerThresholdRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(changeRelayerThresholdRequestConfirmations[id][msg.sender], "not confirmed");
        }
        changeRelayerThresholdRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.RelayerThreshold, voteType, msg.sender, id);
    }

    function newChangeRelayerThresholdRequest(uint256 amount)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        changeRelayerThresholdRequestCounter = changeRelayerThresholdRequestCounter + 1;     
        changeRelayerThresholdRequests[changeRelayerThresholdRequestCounter] = ChangeRelayerThresholdRequest ({
            amount: amount,
            status: false
        });

        changeRelayerThresholdRequestConfirmations[changeRelayerThresholdRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.RelayerThreshold, true, msg.sender, changeRelayerThresholdRequestCounter);

        return changeRelayerThresholdRequestCounter;
    }

    function isSetResourceAvailable(uint256 id)
        external
        view
        override
        returns (address, bytes32, address)
    {
        require(!setResourceRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;

        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(setResourceRequestConfirmations[id][getVoterById(i)]
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");

        return (setResourceRequests[id].handlerAddress, setResourceRequests[id].resourceId, setResourceRequests[id].tokenAddress);
    }
    
    function confirmSetResourceRequest(uint256 id)
        external
        onlyBridge
        override
        returns (bool)
    {
        require(!setResourceRequests[id].status, "already approved");
        setResourceRequests[id].status = true;
        return true;
    }
    
    function newVoteForSetResourceRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!setResourceRequests[id].status, "already approved");
        if(voteType) {
            require(!setResourceRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(setResourceRequestConfirmations[id][msg.sender], "not confirmed");
        }
        setResourceRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.SetResource, voteType, msg.sender, id);
    }

    function newSetResourceRequest(address handlerAddress, bytes32 resourceId, address tokenAddress)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(tokenAddress!= address(0) && handlerAddress != address(0), "zero address");
        setResourceRequestCounter = setResourceRequestCounter + 1;
        setResourceRequests[setResourceRequestCounter] = SetResourceRequest({
            handlerAddress: handlerAddress,
            resourceId: resourceId,
            tokenAddress: tokenAddress,
            status: false
        });

        setResourceRequestConfirmations[setResourceRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.SetResource, true, msg.sender, setResourceRequestCounter);

        return setResourceRequestCounter;
    }

    function isChangeFeeAvailable(uint256 id) 
        external 
        view 
        override
        returns (uint256)
    {
        require(!changeFeeRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(changeFeeRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return changeFeeRequests[id].amount;
    }

    function confirmChangeFeeRequest(uint256 id) 
        external 
        override
        onlyBridge
        returns (bool)
    {
        require(!changeFeeRequests[id].status, "already approved");
        changeFeeRequests[id].status = true;
        return true;
    }

    function newVoteForChangeFeeRequest(bool voteType, uint256 id) 
        external 
        onlyVoter(msg.sender)
    {
        require(!changeFeeRequests[id].status, "already approved");
        if(voteType) {
            require(!changeFeeRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(changeFeeRequestConfirmations[id][msg.sender], "not confirmed");
        }
        changeFeeRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.ChangeFee, voteType, msg.sender, id);
    }

    function newChangeFeeRequest(uint256 amount)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        changeFeeRequestCounter = changeFeeRequestCounter + 1;
        changeFeeRequests[changeFeeRequestCounter] = ChangeFeeRequest({
            amount: amount,
            status: false
        });
        
        changeFeeRequestConfirmations[changeFeeRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.ChangeFee, true, msg.sender, changeFeeRequestCounter);

        return changeFeeRequestCounter;
    }

    function isWithdrawAvailable(uint256 id) 
        external 
        view 
        override
        returns (address, bytes memory)
    {
        require(!withdrawRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(withdrawRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return (withdrawRequests[id].handlerAddress, withdrawRequests[id].data);
    }

    function confirmWithdrawRequest(uint256 id) 
        external 
        override
        onlyBridge
        returns (bool)
    {
        require(!withdrawRequests[id].status, "already approved");
        withdrawRequests[id].status = true;
        return true;
    }

    function newVoteForWithdrawRequest(bool voteType, uint256 id) 
        external 
        onlyVoter(msg.sender)
    {
        require(!withdrawRequests[id].status, "already approved");
        if(voteType) {
            require(!withdrawRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(withdrawRequestConfirmations[id][msg.sender], "not confirmed");
        }
        withdrawRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.Withdraw, voteType, msg.sender, id);
    }

    function newWithdrawRequest(address handlerAddress, bytes calldata data)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(handlerAddress != address(0), "zero address");

        withdrawRequestCounter = withdrawRequestCounter + 1;
        
        withdrawRequests[withdrawRequestCounter] = WithdrawRequest({
            handlerAddress: handlerAddress,
            data: data,
            status: false
        });
        
        withdrawRequestConfirmations[withdrawRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.Withdraw, true, msg.sender, withdrawRequestCounter);

        return withdrawRequestCounter;
    }

    function isSetBurnableAvailable(uint256 id) 
        external 
        view 
        override
        returns (address, address)
    {
        require(!setBurnableRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(setBurnableRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return (setBurnableRequests[id].handlerAddress, setBurnableRequests[id].tokenAddress);
    }

    function confirmSetBurnableRequest(uint256 id) 
        external 
        override
        onlyBridge
        returns (bool)
    {
        require(!setBurnableRequests[id].status, "already approved");
        setBurnableRequests[id].status = true;
        return true;
    }

    function newVoteForSetBurnableRequest(bool voteType, uint256 id) 
        external 
        onlyVoter(msg.sender)
    {
        require(!setBurnableRequests[id].status, "already approved");
        if(voteType) {
            require(!setBurnableRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(setBurnableRequestConfirmations[id][msg.sender], "not confirmed");
        }
        setBurnableRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.SetBurnable, voteType, msg.sender, id);
    }

    function newSetBurnableRequest(address handlerAddress, address tokenAddress)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(tokenAddress!= address(0) && handlerAddress != address(0), "zero address");
        setBurnableRequestCounter = setBurnableRequestCounter + 1;
        setBurnableRequests[setBurnableRequestCounter] = SetBurnableRequest({
            handlerAddress: handlerAddress,
            tokenAddress: tokenAddress,
            status: false
        });
        
        setBurnableRequestConfirmations[setBurnableRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.SetBurnable, true, msg.sender, setBurnableRequestCounter);

        return setBurnableRequestCounter;
    }

    function isSetNonceAvailable(uint256 id) 
        external 
        view 
        override
        returns (uint8, uint64)
    {
        require(!setNonceRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(setNonceRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return (setNonceRequests[id].domainId, setNonceRequests[id].nonce);
    }

    function confirmSetNonceRequest(uint256 id) 
        external 
        override
        onlyBridge
        returns (bool)
    {
        require(!setNonceRequests[id].status, "already approved");
        setNonceRequests[id].status = true;
        return true;
    }

    function newVoteForSetNonceRequest(bool voteType, uint256 id) 
        external 
        onlyVoter(msg.sender)
    {
        require(!setNonceRequests[id].status, "already approved");
        if(voteType) {
            require(!setNonceRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(setNonceRequestConfirmations[id][msg.sender], "not confirmed");
        }
        setNonceRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.SetNonce, voteType, msg.sender, id);
    }

    function newSetNonceRequest(uint8 domainId, uint64 nonce)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        setNonceRequestCounter = setNonceRequestCounter + 1;
        setNonceRequests[setNonceRequestCounter] = SetNonceRequest({
            domainId: domainId,
            nonce: nonce,
            status: false
        });
        
        setNonceRequestConfirmations[setNonceRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.SetNonce, true, msg.sender, setNonceRequestCounter);

        return setNonceRequestCounter;
    }

    function isSetForwarderAvailable(uint256 id) 
        external 
        view
        override 
        returns (address, bool)
    {
        require(!setForwarderRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(setForwarderRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return (setForwarderRequests[id].forwarder, setForwarderRequests[id].valid);
    }

    function confirmSetForwarderRequest(uint256 id) 
        external 
        onlyBridge
        override
        returns (bool)
    {
        require(!setForwarderRequests[id].status, "already approved");
        setForwarderRequests[id].status = true;
        return true;
    }

    function newVoteForSetForwarderRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!setForwarderRequests[id].status, "already approved");
        if(voteType) {
            require(!setForwarderRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(setForwarderRequestConfirmations[id][msg.sender], "not confirmed");
        }
        setForwarderRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.SetForwarder, voteType, msg.sender, id);
    }

    function newSetForwarderRequest(address forwarder, bool valid)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(forwarder != address(0), "zero address");
        setForwarderRequestCounter = setForwarderRequestCounter + 1;
        setForwarderRequests[setForwarderRequestCounter] = SetForwarderRequest({
            forwarder: forwarder,
            valid: valid,
            status: false
        });
        
        setForwarderRequestConfirmations[setForwarderRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.SetForwarder, true, msg.sender, setForwarderRequestCounter);

        return setForwarderRequestCounter;
    }

    function isSetGenericResourceAvailable(uint256 id) 
        external 
        view 
        override
        returns (address, bytes32, address, bytes4, uint256, bytes4)
    {
        require(!setGenericResourceRequests[id].status, "already approved");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(setGenericResourceRequestConfirmations[id][getVoterById(i)] 
            && getVoterStatusByAddress(getVoterById(i))) {
                affirmativeVotesCount++;
            }
        }
        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        
        return (setGenericResourceRequests[id].handlerAddress, 
                setGenericResourceRequests[id].resourceId,
                setGenericResourceRequests[id].contractAddress,
                setGenericResourceRequests[id].depositFunctionSig,
                setGenericResourceRequests[id].depositFunctionDepositerOffset,
                setGenericResourceRequests[id].executeFunctionSig);
    }

    function confirmSetGenericResourceRequest(uint256 id) 
        external
        onlyBridge 
        returns (bool)
    {
        require(!setGenericResourceRequests[id].status, "already approved");
        setGenericResourceRequests[id].status = true;
        return true;
    }

    function newVoteForSetGenericResourceRequest(bool voteType, uint256 id)
        external
        onlyVoter(msg.sender)
    {
        require(!setGenericResourceRequests[id].status, "already approved");
        if(voteType) {
            require(!setGenericResourceRequestConfirmations[id][msg.sender], "already confirmed");
        }
        else {
            require(setGenericResourceRequestConfirmations[id][msg.sender], "not confirmed");
        }
        setGenericResourceRequestConfirmations[id][msg.sender] = voteType;
        emit NewVoteForRequest(RequestType.SetGenericResource, voteType, msg.sender, id);
    }

    function newSetGenericResourceRequest(
        address handlerAddress,
        bytes32 resourceId,
        address contractAddress,
        bytes4 depositFunctionSig,
        uint256 depositFunctionDepositerOffset,
        bytes4 executeFunctionSig)
        external
        onlyVoter(msg.sender)
        returns (uint256)
    {
        require(handlerAddress != address(0) && contractAddress != address(0), "zero address");
        setGenericResourceRequestCounter = setGenericResourceRequestCounter + 1;

        setGenericResourceRequests[setGenericResourceRequestCounter] = SetGenericResourceRequest({
            handlerAddress: handlerAddress,
            resourceId: resourceId,
            contractAddress: contractAddress,
            depositFunctionSig: depositFunctionSig,
            depositFunctionDepositerOffset: depositFunctionDepositerOffset,
            executeFunctionSig: executeFunctionSig,
            status: false
        });
        
        setGenericResourceRequestConfirmations[setGenericResourceRequestCounter][msg.sender] = true;
        emit NewVoteForRequest(RequestType.SetGenericResource, true, msg.sender, setGenericResourceRequestCounter);

        return setGenericResourceRequestCounter;
    }
}
