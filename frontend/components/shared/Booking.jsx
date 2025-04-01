"use client";

import React, { useState, useEffect } from "react";
import { parseEther } from 'viem';
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
  const { address, isConnected } = useAccount(); // Récupère l'adresse de l'utilisateur connecté
  const { writeContract } = useWriteContract(); // Hook pour écrire sur le contrat
  const milesArray = [70, 90, 110, 130]; // Tableau prédéfini des valeurs récupérées depuis BDD AirFrance

  const handleRedeem = (miles) => {

    const amountInWei = parseEther(miles.toString()); // Converti MTK en wei (18 décimales)

    writeContract({
      address: contractAddress,
      abi: ContractAbi.abi,
      functionName: 'redeem',
      args: [amountInWei],
    });
  };

  return (
    <div className="container">
    {isConnected && (
        <>
          {milesArray.map((miles, index) => (
            <div key={index}>
              <button onClick={() => handleRedeem(miles)} disabled={!address} style={{ margin: '5px' }}>
                Redeem {miles} MTK
              </button>
            </div>
          ))}
        </>
      )}
  </div>
  );
}

export default Booking;
