"use client";

// Frameworks
import { Button, ButtonGroup } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { ethers } from "ethers";
// Constants
import { contractAddress } from "@/constants";
// Contract
import ContractAbi from "../../contracts/MobilityToken.json";
// Data
import voyages from "../../data/voyages.json"; // Liste prédéfinie de données récupérées depuis BDD AirFrance
// Styles
import homestyles from "../../styles/Home.module.css";
import bookingstyles from "../../styles/Booking.module.css";

// Hook personnalisé pour vérifier le statut de réclamation
const useClaimedStatus = (address, reference) => {
  const { data: hasBeenClaimed } = useReadContract({
    address: contractAddress,
    abi: ContractAbi.abi,
    functionName: "beenClaimed",
    args: [address, reference],
    watch: true,
  });
  return hasBeenClaimed || false;
};

// Composant pour chaque ligne de voyage
const VoyageRow = ({ voyage, handleRedeem }) => {
  const { address } = useAccount();
  const isClaimed = useClaimedStatus(address, voyage.reference);

  return (
    <tr>
      <td>{voyage.from}</td>
      <td>{voyage.to}</td>
      <td>{voyage.departing}</td>
      <td>{voyage.return}</td>
      <td>{voyage.reference}</td>
      <td>
        {isClaimed ? (
          <div className={bookingstyles.claimed}>Already Claimed</div>
        ) : (
          <button onClick={() => handleRedeem(voyage.miles, voyage.reference)}>
            Claim {voyage.miles} MTK
          </button>
        )}
      </td>
    </tr>
  );
};

// Composant principal
const Booking = () => {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Lire le solde de l'utilisateur
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: ContractAbi.abi,
    functionName: "getBalance",
    args: [address],
  });

  // // Lecture de l'état hasBeenClaimed
  // const { data: hasBeenClaimed, refetch: refetchClaimed } = useReadContract({
  //   address: contractAddress,
  //   abi: ContractAbi.abi,
  //   functionName: 'beenClaimed',
  //   args: [address, reference],
  // });

  // Fonction pour réclamer les tokens
  const handleRedeem = (miles, reference) => {
    const amountInWei = parseEther(miles.toString());
    writeContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: "redeem",
      args: [amountInWei, reference],
    });
  };

  // Rafraîchir le solde après un événement de transfert
  useWatchContractEvent({
    address: contractAddress,
    abi: ContractAbi.abi,
    eventName: "Transfer",
    onLogs: () => {
      refetchBalance();
    },
  });

  return (
    <div>
      <main className={bookingstyles.container}>
        {isConnected && (
          <>
            <div>
              <h2 className={bookingstyles.balance}>
                Your Mobility Balance :{" "}
                <span className={bookingstyles.token}>
                  {balance ? ethers.formatEther(balance) : "0"} MTK
                </span>
              </h2>
            </div>
            <h1 className={homestyles.title}>Your bookings</h1>
            <div>You have no upcoming trips</div>
            <h1 className={homestyles.title}>Previous trips</h1>
            <table className={bookingstyles.bookingTable}>
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Departure Date</th>
                  <th>Arrival Date</th>
                  <th>Booking Reference</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {voyages.map((voyage, index) => (
                  <VoyageRow
                    key={index}
                    voyage={voyage}
                    handleRedeem={handleRedeem}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default Booking;
