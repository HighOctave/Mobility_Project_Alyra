"use client";

// Frameworks
import { Button } from "@heroui/react";
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

const Booking = () => {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [claimedStatuses, setClaimedStatuses] = useState({});

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: ContractAbi.abi,
    functionName: "getBalance",
    args: [address],
  });

  const claimedStatusQueries = voyages.map((voyage) => ({
    reference: voyage.reference,
    ...useReadContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: "beenClaimed",
      args: [address, voyage.reference],
    }),
  }));

  useEffect(() => {
    if (!address) return;
    const statuses = {};
    claimedStatusQueries.forEach((query) => {
      statuses[query.reference] = query.data || false;
    });
    setClaimedStatuses(statuses);
  }, [address, ...claimedStatusQueries.map((q) => q.data)]);

  useWatchContractEvent({
    address: contractAddress,
    abi: ContractAbi.abi,
    eventName: "Transfer",
    onLogs: () => {
      refetchBalance();
      claimedStatusQueries.forEach((query) => query.refetch());
    },
  });

  const handleRedeem = (miles, reference) => {
    const amountInWei = parseEther(miles.toString());
    writeContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: "redeem",
      args: [amountInWei, reference],
    });
  };

  function ClaimButton({ miles, reference }) {
    const isClaimed = claimedStatuses[reference] || false;
    return isClaimed ? (
      <div className={bookingstyles.claimed}>Already Claimed</div>
    ) : (
      <Button onPress={() => handleRedeem(miles, reference)}>
        Claim {miles} MTK
      </Button>
    );
  }

  return (
    <div>
      <main className={bookingstyles.container}>
        {isConnected ? (
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
                  <tr key={index}>
                    <td>{voyage.from}</td>
                    <td>{voyage.to}</td>
                    <td>{voyage.departing}</td>
                    <td>{voyage.return}</td>
                    <td>{voyage.reference}</td>
                    <td>
                      <ClaimButton
                        miles={voyage.miles}
                        reference={voyage.reference}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div>Please connect your wallet</div>
        )}
      </main>
    </div>
  );
};

export default Booking;