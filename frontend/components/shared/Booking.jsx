"use client";

// Frameworks
import {Button} from "@heroui/button";
import React, { useState, useEffect } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  usePublicClient,
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
  const { writeContract: writeUpgrade } = useWriteContract();
  const publicClient = usePublicClient();
  const [claimedStatuses, setClaimedStatuses] = useState({});
  const [loadingReferences, setLoadingReferences] = useState({});
  const [errorReferences, setErrorReferences] = useState({});
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

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

  useEffect(() => {
    if (balance) {
      setUpgradeSuccess(false);
    }
  }, [balance]);

  useWatchContractEvent({
    address: contractAddress,
    abi: ContractAbi.abi,
    eventName: "Transfer",
    onLogs: () => {
      refetchBalance();
      claimedStatusQueries.forEach((query) => query.refetch());
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: ContractAbi.abi,
    eventName: "TokensBurned",
    onLogs: () => {
      refetchBalance();
      setUpgradeSuccess(true);
    },
  });

  const handleRedeem = async (miles, reference) => {
    const amountInWei = parseEther(miles.toString());
    setLoadingReferences((prev) => ({ ...prev, [reference]: true }));
    setErrorReferences((prev) => ({ ...prev, [reference]: false }));

    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: ContractAbi.abi,
        functionName: "redeem",
        args: [amountInWei, reference],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === 'success') {
        setLoadingReferences((prev) => ({ ...prev, [reference]: false }));
      } else {
        setErrorReferences((prev) => ({
          ...prev,
          [reference]: 'Transaction failed',
        }));
        setLoadingReferences((prev) => ({ ...prev, [reference]: false }));
      }
    } catch (error) {
      setErrorReferences((prev) => ({
        ...prev,
        [reference]: error.shortMessage || error.message,
      }));
      setLoadingReferences((prev) => ({ ...prev, [reference]: false }));
    }
  };

  const handleUpgrade = async () => {
    try {
      const result = await writeUpgrade({
        address: contractAddress,
        abi: ContractAbi.abi,
        functionName: "sendAndBurn",
        args: [parseEther("200")], // 200 MTK en wei
      });

      if (result) {
        setUpgradeSuccess(true);
        refetchBalance(); // Rafraîchir le solde
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  function ClaimButton({ miles, reference }) {
    const isClaimed = claimedStatuses[reference] || false;
    const isLoading = loadingReferences[reference] || false;
    const error = errorReferences[reference];

    if (isClaimed) {
      return <div className={bookingstyles.claimed}>Already Claimed</div>;
    }

    if (isLoading) {
      return (
        <Button isDisabled>
          <div className={bookingstyles.spinner} /> Processing...
        </Button>
      );
    }

    if (error) {
      return (
        <div className={bookingstyles.errorContainer}>
          <div className={bookingstyles.error}>{error}</div>
          <Button onPress={() => handleRedeem(miles, reference)} className={bookingstyles.warningButton}>
            Retry
          </Button>
        </div>
      );
    }

    return (
      <Button onPress={() => handleRedeem(miles, reference)} className={bookingstyles.custumButton}>
        Claim {miles} MTK
      </Button>
    );
  }

  // Composant UpgradeButton
  function UpgradeButton() {
    const currentBalance = balance ? parseFloat(ethers.formatEther(balance)) : 0;
    const isDisabled = currentBalance < 200 || upgradeSuccess;

    return upgradeSuccess ? (
      <div className={bookingstyles.successMessage}>
        You have been upgraded with success to First Class.
      </div>
    ) : (
      <Button onPress={handleUpgrade} disabled={isDisabled} className={`${bookingstyles.customButton} ${bookingstyles.upgradeButton}`}>
      Upgrade to First Class (200 MTK)
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
                <tr>
                  <td>Paris (CDG)</td>
                  <td>New York (JFK)</td>
                  <td>2024-03-15 08:30</td>
                  <td>2024-03-15 11:00</td>
                  <td>AF1234</td>
                  <td>
                    <UpgradeButton />
                  </td>
                </tr>
              </tbody>
            </table>
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