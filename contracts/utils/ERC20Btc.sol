pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract ERC20Btc is ERC20PresetMinterPauser {

    /**
     * @dev Allows overriding the name, symbol & decimal of the base ERC20 contract
     */
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {
    }
    
    /// @dev ERC20Btc is changed precision to 8 decimals
    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}