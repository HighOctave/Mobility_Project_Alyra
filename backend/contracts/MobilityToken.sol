// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact d.sanou@gmail.com
contract MobilityToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {

    event Redeemed(address indexed user, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    event LogBadCall(address user);
	event LogDepot(address user, uint quantity);

    constructor(address owner)
        ERC20("MobilityToken", "MTK")
        Ownable(owner)
        ERC20Permit("MobilityToken")
    {
        // Mint initial supply to owner and contract
        _mint(owner, 10000000 * 10 ** decimals());
        _mint(address(this), 5000000 * 10 ** decimals()); // Réserve initiale pour le redeem
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Fonction redeem transfère depuis le contrat vers l'utilisateur
    function redeem(uint256 amount) external payable {
        require(
            balanceOf(address(this)) >= amount, 
            "MobilityToken: Insufficient contract balance"
        );
        
        _transfer(address(this), msg.sender, amount);
        emit Redeemed(msg.sender, amount);
    }

    // Fonction pour brûler ses propres jetons avec retour de statut
    function sendAndBurn(uint256 amount) external returns (bool) {
        if (amount == 0 || balanceOf(msg.sender) < amount) {
            return false;
        }
        
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
        return true;
    }

    // Fonction optionnelle pour alimenter le contrat en jetons
    function fundContract(uint256 amount) external onlyOwner {
        _transfer(owner(), address(this), amount);
    }

    fallback() external { emit LogBadCall(msg.sender);}
	
	receive() external payable { emit LogDepot(msg.sender, msg.value);}
}