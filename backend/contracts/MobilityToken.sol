// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact d.sanou@gmail.com
contract MobilityToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {

    mapping(address => mapping(string => bool)) public hasBeenClaimed;

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

    // Vérifie si une référence a été réclamée par une adresse
    function beenClaimed(address user, string memory boardingref) public view returns (bool) {
        require(bytes(boardingref).length == 6, "Reference must have six characters");
        return hasBeenClaimed[user][boardingref];
    }

    // Fonction redeem transfère depuis le contrat vers l'utilisateur
    function redeem(uint256 amount, string memory boardingref) external payable {
        require(bytes(boardingref).length == 6, "Reference must have six characters");
        require(!hasBeenClaimed[msg.sender][boardingref], "Token already claimed");
        require(
            balanceOf(address(this)) >= amount, 
            "MobilityToken: Insufficient contract balance"
        );
        
        hasBeenClaimed[msg.sender][boardingref] = true;
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

    // Fonction pour vérifier le solde d'un utilisateur
    function getBalance(address user) public view returns (uint256) {
        return balanceOf(user);
    }

    // Fonction optionnelle pour alimenter le contrat en jetons
    function fundContract(uint256 amount) external onlyOwner {
        _transfer(owner(), address(this), amount);
    }

    fallback() external { emit LogBadCall(msg.sender);}
	
	receive() external payable { emit LogDepot(msg.sender, msg.value);}
}