"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
//import ContractAbi from "../../contracts/Voting.json";
import "../../styles/main.css";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Booking = () => {
  
  const { address, isConnected } = useAccount();
  
  //DISPLAY
  return (
    <div className="container">
      {isConnected && (
        <p>
          Hello button
        </p>
      )}
    </div>
  );
};

export default Booking;
