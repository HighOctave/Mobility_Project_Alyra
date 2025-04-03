"use client";

//Frameworks
import {Button, ButtonGroup} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
//Constants
import { contractAddress } from "@/constants";
//Contract
import ContractAbi from "../../contracts/MobilityToken.json";
//Data
import voyages from "../../data/voyages.json"; // Liste prédéfinie de données récupérées depuis BDD AirFrance
//Styles
import homestyles from "../../styles/Home.module.css";
import bookingstyles from "../../styles/Booking.module.css";

const Booking = () => {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const handleRedeem = (miles) => {
    const amountInWei = parseEther(miles.toString()); // MTK en wei (18 décimales)

    writeContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: "redeem",
      args: [amountInWei],
    });
  };

  function ClaimButton({ miles, isClaimed }) {
    if (isClaimed) {
      return (
        <div className={bookingstyles.claimed}>
          Already Claimed
        </div>
      );
    }
    return (
      <Button onPress={() => handleRedeem(miles)}> Claim {miles} MTK </Button>
    );
  }

  return (
    <div>
      <main className={bookingstyles.container}>
        {isConnected && (
          <>
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
                {voyages.map((voyage, index) => {
                  return (
                    <tr key={index}>
                      <td>{voyage.from}</td>
                      <td>{voyage.to}</td>
                      <td>{voyage.departing}</td>
                      <td>{voyage.return}</td>
                      <td>{voyage.reference}</td>
                      <td>
                        <ClaimButton
                          isClaimed={voyage.hasBeenClaimed}
                          miles={voyage.miles}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default Booking;
