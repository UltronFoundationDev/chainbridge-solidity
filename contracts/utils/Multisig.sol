pragma solidity 0.8.11;

/// @notice Multisig contract, which provides multisig functions that could be implemented when needed
contract Multisig {
    event InsertingVoter(address indexed _address);
    event RemovingVoter(address indexed _address);
    event ConfirmingRequest(address indexed sender, uint256 indexed requestId);
    event RemovingRequest(address indexed sender, uint256 indexed requestId);

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
     * @notice Throws if sender is not a voter
    */
    modifier onlyVoter() {
        require(voters[msg.sender], "not a voter");
        _;
    }

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
    modifier isVoter(address _address) {
        require(voters[_address], "not a voter");
        _;
    }

    /**
     * @notice Throws if address is already a voter
     * @param _address the cheking address
    */
    modifier notVoter(address _address) {
        require(!voters[_address], "already a voter");
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
     * @notice Throws if voter has not confirmed the request
     * @param requestId the id of request
     * @param voterAddress confirming voter address
    */
    modifier confirmed(uint256 requestId, address voterAddress) {
        require(voterConfirmations[requestId][voterAddress], "not confirmed");
        _;
    }

    /**
     * @notice Throws if voter has already confirmed the request
     * @param requestId the id of request
     * @param voterAddress addres of voter
    */
    modifier notConfirmed(uint256 requestId, address voterAddress) {
        require(!voterConfirmations[requestId][voterAddress], "already confirmed");
        _;
    }

    /**
     * @notice Throws if active voters count is not empty
    */
    modifier isActiveVotersEmpty() {
        require(activeVotersCount == 0, "Act. voters not empty");
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
        isActiveVotersEmpty
    {
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
        notVoter(newVoterAddress)
    {
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
        notNullAddress(oldVoterAddress)
        isVoter(oldVoterAddress)
    {
        voters[oldVoterAddress] = false;
        activeVotersCount--;
        emit RemovingVoter(oldVoterAddress);
    }

    /** 
     * @notice Replaces old voter address with new address in the voter list 
     * if addresses are not zero addresses, old voter address is a voter
     * and new voter address in not a voter
     * @dev Triggers insert, remove events(logging inserted and removed addresses)
     * @param oldVoterAddress the address, which should be removed
     * @param newVoterAddress the address, which should be inserted
    */
    function replaceVoter(address oldVoterAddress, address newVoterAddress)
        external
        notNullAddress(oldVoterAddress)
        isVoter(oldVoterAddress)
        notNullAddress(newVoterAddress)
        notVoter(newVoterAddress)
    {
        voters[oldVoterAddress] = false;
        voters[newVoterAddress] = true;
        voterIds[votersCounter++] = newVoterAddress;
        emit RemovingVoter(oldVoterAddress);
        emit InsertingVoter(newVoterAddress);
    }

    /**
     * @notice Allows a voter to insert a confirmation for a transaction
     * if sender is a voter, voter request is confirmed, voter request is not approved  
     * @param voterRequestId voter request id
    */ 
    function insertConfirmation(uint256 voterRequestId)
        internal
        onlyVoter
        notConfirmed(voterRequestId, msg.sender)
        voterRequestExists(voterRequestId)
        notExecuted(voterRequestId)
    {
        voterConfirmations[voterRequestId][msg.sender] = true;
        emit ConfirmingRequest(msg.sender, voterRequestId);
    }

    /**
     * @notice Allows a voter to remove a confirmation for a transaction
     * if sender is a voter, voter request is confirmed, voter request is not approved  
     * @param voterRequestId voter request id
    */ 
    function removeConfirmation(uint256 voterRequestId)
        internal
        onlyVoter
        confirmed(voterRequestId, msg.sender)
        notExecuted(voterRequestId)
    {
        voterConfirmations[voterRequestId][msg.sender] = false;
        emit RemovingRequest(msg.sender, voterRequestId);
    }

    /**
     * @notice Allows a voter to add a confirmation for a request
     * if sender is a voter, voter request is confirmed, voter request is not approved  
     * @param _voters list of voters addresses
    */
    function insertVoterRequest(address[] memory _voters) 
        external 
        onlyVoter 
    {
        for(uint256 i = 0; i < _voters.length; i++) {
            require(!voters[_voters[i]], "already a voter");
            voterRequestsCounter = voterRequestsCounter + 1;
            voterRequests[voterRequestsCounter] = VoterRequest({
                executed: false,
                candidate: _voters[i],
                include: true
            });
            insertConfirmation(voterRequestsCounter);
        }
    }

    /**
     * @notice Allows a voter to remove a confirmation for a request
     * if sender is a voter, voter request is confirmed, voter request is not approved  
     * @param _voters list of voters addresses
    */
    function removeVoterRequest(address[] memory _voters) 
        external
        onlyVoter
    {
        for(uint256 i = 0; i < _voters.length; i++) {
            require(voters[_voters[i]], "not a voter");
            voterRequestsCounter = voterRequestsCounter + 1;
            voterRequests[voterRequestsCounter] = VoterRequest({
                executed: false,
                candidate: _voters[i],
                include: false
            });
            removeConfirmation(voterRequestsCounter);
        }
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