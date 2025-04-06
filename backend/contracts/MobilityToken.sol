// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mobility Token (MTK)
 * @dev ERC20 avec mécanisme de réclamation sécurisé et fonctions de burn
 * @custom:security-contact d.sanou@gmail.com
 */
contract MobilityToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    // ===========================
    // ==== États et Événements ====
    // ===========================

    mapping(address => mapping(string => bool)) public hasBeenClaimed;

    event Redeemed(address indexed user, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    // ======================
    // ==== Constructeur ====
    // ======================

    /// @dev Initialise le contrat avec la supply de base
    /// @param owner Adresse du propriétaire initial
    constructor(
        address owner
    )
        ERC20("MobilityToken", "MTK")
        Ownable(owner)
        ERC20Permit("MobilityToken")
    {
        // Mint initial supply to owner and contract
        _mint(owner, 10000000 * 10 ** decimals());
        _mint(address(this), 5000000 * 10 ** decimals()); // Réserve initiale pour le redeem
    }

    // =============================
    // ==== Fonctions Publiques ====
    // =============================

    /// @notice Vérifie si une référence a été utilisée
    function beenClaimed(
        address user,
        string memory boardingref
    ) public view returns (bool) {
        require(
            bytes(boardingref).length == 6,
            "Reference must have six characters"
        );
        return hasBeenClaimed[user][boardingref];
    }

    /// @notice Vérifie le solde d'un utilisateur
    function getBalance(address user) public view returns (uint256) {
        return balanceOf(user);
    }

    /// @notice Réclame des tokens avec une référence unique
    function redeem(
        uint256 amount,
        string memory boardingref
    ) external payable {
        require(
            bytes(boardingref).length == 6,
            "Reference must have six characters"
        );
        require(
            !hasBeenClaimed[msg.sender][boardingref],
            "Token already claimed"
        );
        require(
            balanceOf(address(this)) >= amount,
            "MobilityToken: Insufficient contract balance"
        );

        hasBeenClaimed[msg.sender][boardingref] = true;
        _transfer(address(this), msg.sender, amount);
        emit Redeemed(msg.sender, amount);
    }

    /// @notice Brûle les tokens de l'appelant
    function sendAndBurn(uint256 amount) external returns (bool) {
        if (amount == 0 || balanceOf(msg.sender) < amount) {
            return false;
        }

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
        return true;
    }

    // =================================
    // ==== Fonctions du Propriétaire ====
    // =================================

    /// @notice Mint de nouveaux tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /// @notice Alimente le contrat en tokens
    function fundContract(uint256 amount) external onlyOwner {
        _transfer(owner(), address(this), amount);
    }

    // ==============================
    // ==== Gestion des Erreurs/Depots ====
    // ==============================

    /// @dev Intercepte les appels non valides
    fallback() external {
        emit LogBadCall(msg.sender);
    }

    /// @dev Intercepte les dépots sur le contrat
    receive() external payable {
        emit LogDepot(msg.sender, msg.value);
    }
}
