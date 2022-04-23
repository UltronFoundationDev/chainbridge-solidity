pragma solidity 0.8.11;

/// @title Multisignature contract implementation
/// @notice Multisig contract, which provides multisig functions that could be implemented when needed
contract Multisig {
    event InsertingVoter(address indexed _address);
    event RemovingVoter(address indexed _address);
    event VoteForVoterRequest(bool indexed voteType, address indexed sender, uint256 indexed requestId);

    // mapping voter id => voter address
    mapping(uint256 => address) private voterIds;
    // mapping is address a voter
    mapping(address => bool) private voters;
    // all voters count
    uint256 private votersCounter;
    // confimerd voters count
    uint256 private activeVotersCount;

    // vote request for inserting/removing voters
    struct VoterRequest {
        bool executed;
        address candidate;
        bool include;
    }

    // mapping of voter requests in order to insert/remove voters
    mapping(uint256 => VoterRequest) private voterRequests;
    // mapping of required confirmations in order to approve voter request
    mapping(uint256 => mapping(address => bool)) private voterConfirmations;
    // count of vote requests
    uint256 private voterRequestsCounter;

    /**
     * @notice Throws if address is zero address
     * @param _address the checking address
    */
    modifier notNullAddress(address _address) {
        require(_address != address(0), "zero address");
        _;
    }

    /**
     * @notice Throws if address is not a voter
     * @param _address the checking address
    */
    modifier onlyVoter(address _address) {
        require(voters[_address], "not a voter");
        _;
    }

    /**
     * @notice Throws if voter request address is zero address
     * @param voterRequestId the checking voter request Id
    */
    modifier voterRequestExists(uint voterRequestId) {
        require(voterRequests[voterRequestId].candidate != address(0), "voter address is zero");
        _;
    }

    /**
     * @notice Throws if request is already approved(executed)
     * @param requestId the checking id of request
    */
    modifier notExecuted(uint256 requestId) {
        require(!voterRequests[requestId].executed, "already executed");
        _;
    }
    
    /**
     * @notice Returns voter address by id if id != 0
     * @param id the id of voter 
    */
    function getVoterById(uint256 id) 
        public 
        view 
        returns (address) 
    {
        return voterIds[id];
    }

    /**
     * @notice Returns the address precense in voters list 
     * if address != zero address
     * @param _address the checking address 
    */
    function getVoterStatusByAddress(address _address) 
        public 
        view
        notNullAddress(_address) 
        returns (bool) 
    {
        return voters[_address];
    }

    /**
     * @notice Returns overall Voters Count
    */
    function getActiveVotersCount() 
        public 
        view 
        returns(uint256) 
    {
        return activeVotersCount;
    }

    /**
     * @notice Returns voters list counter
    */
    function getVotersCounter() 
        internal 
        view 
        returns(uint256) 
    {
        return votersCounter;
    }

    /**
     * @notice Adds new voter if voter list is empty
    */
    function insertInitialVoter()
        external
    {
        require(activeVotersCount == 0, "Act. voters not empty");
        insertVoter(msg.sender);
    }

    /**
     * @notice Adds new voter to the voter list 
     * if address is not zero address and is not a voter
     * @dev Triggers insert event(logging inserted address)
     * @param newVoterAddress the address, which should be added
    */
    function insertVoter(address newVoterAddress) 
        internal 
        notNullAddress(newVoterAddress) 
    {
        require(!voters[newVoterAddress], "already a voter");
        voters[newVoterAddress] = true;
        activeVotersCount++;
        voterIds[votersCounter++] = newVoterAddress;
        emit InsertingVoter(newVoterAddress);
    }

    /** 
     * @notice Removes voter from the voter list 
     * if address is not zero address and is already a voter
     * @dev Triggers remove event(logging removed address)
     * @param oldVoterAddress the address, which should be removed
    */
    function removeVoter(address oldVoterAddress) 
        internal 
        onlyVoter(oldVoterAddress)
    {
        voters[oldVoterAddress] = false;
        activeVotersCount--;
        emit RemovingVoter(oldVoterAddress);
    }

    /**
     * @notice Allows a voter to insert a confirmation for a transaction
     * if sender is a voter, voter request is confirmed, voter request is not approved 
     * @param voteType the vote type: true/false = insert/remove vote
     * @param voterRequestId voter request id
    */ 
    function newVoteForVoterRequest(bool voteType, uint256 voterRequestId)
        external
        onlyVoter(msg.sender)
        voterRequestExists(voterRequestId)
        notExecuted(voterRequestId)
    {
        if(voteType) {
            require(!voterConfirmations[voterRequestId][msg.sender], "already confirmed");
        }
        else {
            require(voterConfirmations[voterRequestId][msg.sender], "not confirmed");
        }
        voterConfirmations[voterRequestId][msg.sender] = voteType;
        emit VoteForVoterRequest(voteType, msg.sender, voterRequestId);
    }

    /**
     * @notice Allows a voter to add a confirmation for a request
     * if sender is a voter, voter request is confirmed, voter request is not approved  
     * @param voterAddress new voter address
     * @param include insert/remove(true/false) voter from voter list
    */
    function newVoterRequest(bool include, address voterAddress) 
        external 
        notNullAddress(voterAddress)
        onlyVoter(msg.sender)
    {
        if(include) {
            require(!voters[voterAddress], "already a voter");
        } 
        else {
            require(voters[voterAddress], "not a voter");
        }
        voterRequestsCounter = voterRequestsCounter + 1;
        voterRequests[voterRequestsCounter] = VoterRequest({
            executed: false,
            candidate: voterAddress,
            include: include
        });
        voterConfirmations[voterRequestsCounter][msg.sender] = true;
        emit VoteForVoterRequest(true, msg.sender, voterRequestsCounter);
    }

    /**
     * @notice Approves voter request if there is enough votes and request is not executed 
     * @param voterRequestId request is to executed
    */
    function votersRequestConclusion(uint256 voterRequestId)
        external
        notExecuted(voterRequestId)
    {
        uint256 requiredVotesAmount = (activeVotersCount * 100) / 2;
        uint256 affirmativeVotesCount = 0;
        for(uint256 i = 0; i < votersCounter; i++) {
            if(voterConfirmations[voterRequestId][voterIds[i]] && voters[voterIds[i]]) {
                    affirmativeVotesCount++;
            }
        }

        require(affirmativeVotesCount * 100 > requiredVotesAmount, "not enough votes");
        if(voterRequests[voterRequestId].include) {
            insertVoter(voterRequests[voterRequestId].candidate);
        }
        else {
            removeVoter(voterRequests[voterRequestId].candidate);
        }

        voterRequests[voterRequestId].executed = true;
    }
}