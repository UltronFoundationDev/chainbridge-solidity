pragma solidity 0.8.11;

import "./interfaces/IDAO.sol";
import "./utils/Multisig.sol";

/// @notice DAO contract, which provides owner changing
contract DAO is Multisig, IDAO {
    event ConfirmingOwnerChangeRequest(address indexed sender, uint256 indexed requestId);
    event RemovingOwnerChangeRequest(address indexed sender, uint256 indexed requestId);
    
    event ConfirmingTransferRequest(address indexed sender, uint256 indexed requestId);
    event RemovingTransferRequest(address indexed sender, uint256 indexed requestId);

    struct OwnerChangeRequest {
        address newOwner;
        bool status;
    }

    struct TransferRequest {
        address recepient;
        address token;
        uint256 value;
        bool status;
    }

    // mapping of owner change requests
    mapping(uint256 => OwnerChangeRequest) private ownerChangeRequests;
    // mapping of owner chnaged request confirmations
    mapping(uint256 => mapping(address => bool)) private ownerChangesRequestConfirmations;
    // id for new owner change request
    uint256 private ownerChangeRequestCounter;

    // mapping of transfer requests
    mapping(uint256 => TransferRequest) private transferRequests;
    // mapping of signs of transfer requests
    mapping(uint256 => mapping(address => bool)) private transferRequestConfirmations;
    // id for new transfer request
    uint256 private transferRequestCounter;

    /**
     * @notice Throws error if owner change request is already approved
     * @param id the id of owner change request
    */
    modifier notApprovedOwnerChange(uint256 id) {
        require(!ownerChangeRequests[id].status, "already approved");
        _;
    }

    /**
     * @notice Throws if voter has already confirmed the owner change request
     * @param id the id of change owner request
     * @param voterAddress addres of voter
    */
    modifier notConfirmedOwnerChange(uint256 id, address voterAddress) {
        require(!ownerChangesRequestConfirmations[id][voterAddress], "already confirmed");
        _;
    }

    /**
     * @notice Throws if voter has not confirmed the owner change request
     * @param id the id of change owner request
     * @param voterAddress confirming voter address
    */
    modifier confirmedOwnerChange(uint256 id, address voterAddress) {
        require(ownerChangesRequestConfirmations[id][voterAddress], "not confirmed");
        _;
    }

    /**
     * @notice Throws error if transfer request is already approved
     * @param id the id of transfer request
    */
    modifier notApprovedTransferRequest(uint256 id) {
        require(!transferRequests[id].status, "already approved");
        _;
    }

    /**
     * @notice Throws if voter has already confirmed the transfer request
     * @param id the id of transfer request
     * @param voterAddress addres of voter
    */
    modifier notConfirmedTransferRequest(uint256 id, address voterAddress) {
        require(!transferRequestConfirmations[id][voterAddress], "already confirmed");
        _;
    }

    /**
     * @notice Throws if voter has not confirmed the transfer request
     * @param id the id of transfer request
     * @param voterAddress confirming voter address
    */
    modifier confirmedTransferRequest(uint256 id, address voterAddress) {
        require(transferRequestConfirmations[id][voterAddress], "not confirmed");
        _;
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
        notApprovedOwnerChange(id)
        returns (address)
    {
        require(ownerChangeRequests[id].newOwner != address(0), "zero address");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(ownerChangesRequestConfirmations[id][getVoterById(id)] 
            && getVoterStatusByAddress(getVoterById(id))) {
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
    function confirmOwnerChange(uint256 id) 
        external 
        override
        notApprovedOwnerChange(id)
        returns (bool)
    {
        ownerChangeRequests[id].status = true;
        return true;
    }

    /**
     * @notice Allows a voter to insert a confirmation for owner change request 
     * if it is not approved and not confirmed
     * @param id the id of owner change request
    */
    function insertVoteForOwnerChangeRequest(uint256 id) 
        external 
        notApprovedOwnerChange(id)
        notConfirmedOwnerChange(id, msg.sender)
        onlyVoter
    {
        ownerChangesRequestConfirmations[id][msg.sender] = true;
        emit ConfirmingOwnerChangeRequest(msg.sender, id);
    }

    /**
     * @notice Allows a voter to remove a confirmation from owner change request 
     * if it is not approved and it was already confirmed
     * @param id the id of owner change request
    */
    function removeVoteFromOwnerChangeRequest(uint256 id) 
        external 
        notApprovedOwnerChange(id)
        confirmedOwnerChange(id, msg.sender)
        onlyVoter
    {
        ownerChangesRequestConfirmations[id][msg.sender] = false;
        emit RemovingOwnerChangeRequest(msg.sender, id);
    }

    /**
     * @notice Creation of change owner request by any voter
     * @param _address new owner address
    */
    function newOwnerChangeRequest(address _address)
        external
        onlyVoter
        returns (uint256)
    {
        ownerChangeRequestCounter = ownerChangeRequestCounter + 1;
        
        ownerChangeRequests[ownerChangeRequestCounter] = OwnerChangeRequest
        ({
            newOwner: _address,
            status: false
        });
        
        ownerChangesRequestConfirmations[ownerChangeRequestCounter][msg.sender] = true;
        emit ConfirmingOwnerChangeRequest(msg.sender, ownerChangeRequestCounter);

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
        notApprovedTransferRequest(id)
        returns (uint256, address, address)
    {
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 affirmativeVotesCount = 0;

        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(transferRequestConfirmations[id][getVoterById(id)]
            && getVoterStatusByAddress(getVoterById(id))) {
                affirmativeVotesCount++;
            }
        }

        require(affirmativeVotesCount * 100 > consensus, "not enough votes");
        return (transferRequests[id].value, transferRequests[id].recepient, transferRequests[id].token);
    }

    /**
     * @notice Approves transfer request if it is not approved
     * @param id the id of transfer request
    */
    function confirmTransfer(uint256 id)
        external
        override
        notApprovedTransferRequest(id)
        returns (bool)
    {
        transferRequests[id].status = true;
        return true;
    }

    /**
     * @notice Allows a voter to insert a confirmation for transfer request 
     * if it is not approved and not confirmed
     * @param id the id of transfer request
    */
    function insertVoteForTransferRequest(uint256 id)
        external
        onlyVoter
        notApprovedTransferRequest(id)
        notConfirmedTransferRequest(id, msg.sender)
    {
        transferRequestConfirmations[id][msg.sender] = true;
        emit ConfirmingTransferRequest(msg.sender, id);
    }

    /**
     * @notice Allows a voter to remove a confirmation from transfer request 
     * if it is not approved and it was already confirmed
     * @param id the id of transfer request
    */
    function removeVoteFromTransferRequest(uint256 id)
        external
        onlyVoter
        notApprovedTransferRequest(id)
        confirmedTransferRequest(id, msg.sender)
    {
        transferRequestConfirmations[id][msg.sender] = false;
        emit RemovingTransferRequest(msg.sender, id);
    }

    /**
     * @notice Creation of transfer request by any voter
     * @param recepient the recepient address
     * @param tokenAddress the token address, which we want to send
     * @param amount the amount of tokens, which we want to send
    */
    function newTransferRequest(address recepient, address tokenAddress, uint256 amount)
        external
        onlyVoter
        returns (uint256)
    {
        transferRequestCounter = transferRequestCounter + 1;
        transferRequests[transferRequestCounter] = TransferRequest
        ({
            recepient: recepient,
            token: tokenAddress,
            value: amount,
            status: false
        });

        transferRequestConfirmations[transferRequestCounter][msg.sender] = true;
        emit ConfirmingTransferRequest(msg.sender, transferRequestCounter);

        return transferRequestCounter;
    }
}
