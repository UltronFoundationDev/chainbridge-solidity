/**
 * @title DAO library
 * @author Ultron
 * @notice Implements the base logic for all the actions related to DAO
 */
library DAOLibrary { 
    enum RequestStatus {
        Canceled,
        Active,
        Executed
    }

    struct VoterRequest {
        address candidate;
        bool include;
        RequestStatus status;
    }

    struct RequestTypes {
        VoterRequest VoterRequest;
    }

    // /**
    //  * @notice Counts and gets affirmative votes for voter request
    //  * @param voterRequestId request id to be executed
    // */
    // function countGetVotersAffirmativeVotes(mapping(), uint256 voterRequestId) public view returns(uint256 affirmativeVotesCount) {
    //     for(uint256 i = 0; i < votersCounter; i++) {
    //         if(voterConfirmations[voterRequestId][voterIds[i]] && voters[voterIds[i]]) {
    //                 affirmativeVotesCount++;
    //         }
    //     }
    // }

    // /**
    //  * @notice Throws if address is not a voter
    //  * @param _address the checking address
    // */
    modifier onlyVoter(mapping(address => bool) storage voters, address _address) {
        require(voters[_address], "not a voter");
        _;
    }

    // /**
    //  * @notice Allows a voter to insert a confirmation for a transaction
    //  * if sender is a voter, voter request is confirmed, voter request is not approved 
    //  * @param voteType the vote type: true/false = insert/remove vote
    //  * @param requestId voter request id
    // */ 
    function newVoteForVoterRequest(
        mapping(address => bool) storage voters,
        mapping(uint256 => RequestTypes) storage requests,
        mapping(uint256 => mapping(address => bool)) storage requestConfirmations,
        bool voteType, 
        uint256 requestId)
        internal
        onlyVoter(voters, msg.sender)
    {
        require(requests[requestId].VoterRequest.status == RequestStatus.Active, "already executed");
        if(voteType) {
            require(!requestConfirmations[requestId][msg.sender], "already confirmed");
        }
        else {
            require(requestConfirmations[requestId][msg.sender], "not confirmed");
        }
        requestConfirmations[requestId][msg.sender] = voteType;
        //emit VoteForVoterRequest(voteType, msg.sender, requestId);
    }

    // /**
    //  * @notice Cancels voter request 
    //  * @param voterRequestId request id to be canceled
    // */
    function cancelVoterRequest(
        mapping(address => bool) storage voters,
        mapping(uint256 => RequestTypes) storage requests,
        uint256 requestId)
        internal
        onlyVoter(voters, msg.sender)
    {
        require(requests[requestId].VoterRequest.status == RequestStatus.Active, "not active");
        requests[requestId].VoterRequest.status = RequestStatus.Canceled;
    }
}