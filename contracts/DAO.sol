pragma solidity 0.8.11;

import "./interfaces/IDAO.sol";
import "./utils/Multisig.sol";

/// @notice DAO contract, which provides owner changing
contract DAO is Multisig, IDAO {
    struct OwnerChangeRequest {
        address newOwner;
        bool status;
    }

    // mapping of owner change requests
    mapping(uint256 => OwnerChangeRequest) private ownerChangeRequests;
    // mapping of owner chnaged request confirmations
    mapping(uint256 => mapping(address => bool)) private ownerChangesRequestConfirmations;
    // id for new owner change request
    uint256 private ownerChangeRequestCounter;

    /**
     * @notice Throws error if owner change request is already approved
     * @param id the id of owner change request
    */
    modifier notApproved(uint256 id) {
        require(!ownerChangeRequests[id].status, "already approved");
        _;
    }

    /**
     * @notice Throws if voter has already confirmed the owner change request
     * @param id the id of request
     * @param voterAddress addres of voter
    */
    modifier notConfirmedOwnerChange(uint256 id, address voterAddress) {
        require(!ownerChangesRequestConfirmations[id][voterAddress], "already confirmed");
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
        notApproved(id)
        returns (address)
    {
        require(ownerChangeRequests[id].newOwner != address(0), "zero address");
        uint256 consensus = (getActiveVotersCount() * 100) / 2;
        uint256 trueVotesCount = 0;
        
        for(uint256 i = 0; i <= getVotersCounter(); i++) {
            if(ownerChangesRequestConfirmations[id][getVoterById(id)] 
            && getVoterStatusByAddress(getVoterById(id))) {
                trueVotesCount++;
            }
        }
        require(trueVotesCount * 100 > consensus, "not enough votes");
        
        return ownerChangeRequests[id].newOwner;
    }

    /**
     * @notice Approves changing owner request if it is not approved
     * @param id the id of owner change request
    */
    function confirmOwnerChange(uint256 id) 
        external 
        override
        notApproved(id)
        returns (bool)
    {
        ownerChangeRequests[id].status = true;
        return true;
    }

    /**
     * @notice Allows a voter to insert a confirmation for owner change request 
     * if it is not approved
     * @param id the id of owner change request
    */
    function voteForOwnerChangeRequest(uint256 id) 
        external 
        notApproved(id)
        notConfirmedOwnerChange(id, msg.sender)
        onlyVoter
    {
        ownerChangesRequestConfirmations[id][msg.sender] = true;
        emit ConfirmingRequest(msg.sender, id);
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
        emit ConfirmingRequest(msg.sender, ownerChangeRequestCounter);

        return ownerChangeRequestCounter;
    }
}
