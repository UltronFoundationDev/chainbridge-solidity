pragma solidity 0.8.11;

/// @notice Multisig contract, which provides multisig functions that could be implemented when needed
contract Multisig {
    event InsertingVoter(address indexed _address);
    event RemovingVoter(address indexed _address);
    event ConfirmingRequest(address indexed sender, uin256 requestId);
    event Execution(uint256 indexed requestId);
    event ExecutionFailure(uint256 indexed requestId);

    // mapping voter id => voter address
    mapping(uint256 => address) private votersIds;
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
    modifier notNull(address _address) {
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
     * @param voterAddress 
    */
    modifier notConfirmed(uint256 requestId, address voterAddress) {
        require(!voterConfirmations[requestId][voterAddress], "already confirmed");
        _;
    }

    /**
     * @notice Returns voter address by id
     * @param id the id of voter 
    */
    function getVoterById(uint256 id) public view returns (address) {
        return voterIds[id];
    }

    /**
     * @notice Returns the address precense in voters list
     * @param _address the checking address 
    */
    function getVoterStatusByAddress(address _address) public  view returns (bool) {
        return voters[_address];
    }

    /**
     * @notice Returns overall Voters Count
    */
    function getActiveVotersCount() public view returns(uint256) {
        return activeVotersCount;
    }

    /**
     * @notice Returns voters list counter
    */
    function getVotersCounter() internal view returns(uint256) {
        return votersCounter;
    }

    /**
     * @notice Adds new voter to the voter list 
     * if address is not zero address and is not a voter
     * @dev Triggers insert event(logging inserted address)
     * @param newVoterAddress the address, which should be added
    */
    function insertVoter(address newVoterAddress) 
        internal 
        notNull(newVoterAddress) 
        notVoter(newVoterAddress)
    {
        voters[newVoterAddress] = true;
        activeVotersCount++;
        votersIds[votersCounter++] = newVoterAddress;
        InsertingVoter(newVoterAddress);
    }

    /** 
     * @notice Removes voter from the voter list 
     * if address is not zero address and is already a voter
     * @dev Triggers remove event(logging removed address)
     * @param oldVoterAddress the address, which should be removed
    */
    function removeVoter(address oldVoterAddress) 
        internal 
        notNull(oldVoterAddress)
        isVoter(oldVoterAddress)
    {
        voters[oldVoterAddress] = false;
        activeVoters--;
        RemovingVoter(oldVoterAddress);
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
        internal
        notNull(oldVoterAddress)
        isVoter(oldVoterAddress)
        notNull(newVoterAddress)
        notVoter(newVoterAddress)
    {
        voters[oldVoterAddress] = false;
        voters[newVoterAddress] = true;
        votersIds[votersCounter++] = newVoterAddress;
        RemovingVoter(oldVoterAddress);
        InsertingVoter(newVoterAddress);
    }
}