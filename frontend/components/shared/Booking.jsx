"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import ContractAbi from "../../contracts/MobilityToken.json";
import "../../styles/main.css";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Booking = () => {
  const { address, isConnected } = useAccount();

  //EFFECTS
  // useEffect(() => {
  //   if (address) {
  //     isConnected = true;
  //   }
  // }, [
  //   address,
  // ]);

  //EVENTS
  useWatchContractEvent({
    address: contractAddress,
    abi: ContractAbi.abi,
    eventName: "Redeemed",
    onLogs(logs) {
      console.log("Redeemed!", logs);
    },
  });

  // WRITE CONTRACT
  const { writeContract } = useWriteContract();

  const redeem = (amount) => {
    writeContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: "redeem",
      args: [amount],
    });
  };

  //DISPLAY
  return (
  <div className="container">
    {isConnected && (
        <>
          <p>You are connected</p>
          {
              <button onClick={() => redeem(10)} >Claim</button>
          }
          
          {/* {isConnected && (
            <button onClick={redeem(10)}>
              Claim
            </button>
          )} */}
        </>
      )}
  </div>);
};

export default Booking;
