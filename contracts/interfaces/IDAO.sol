pragma solidity 0.8.11;

interface IDAO {
    function isOwnerChangeAvailable(uint256 id) external view returns (address);
    function confirmOwnerChange(uint256 id) external returns (bool);
}