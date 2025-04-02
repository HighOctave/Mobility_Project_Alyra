"use client";

import {Button} from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
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
import styles from "../../styles/Home.module.css";
import "../../styles/main.css";
import "../../styles/airfrance.css";


//const contractAddress = contract.contractAddress;

const Booking = () => {
  const { address, isConnected } = useAccount(); // Récupère l'adresse de l'utilisateur connecté
  const { writeContract } = useWriteContract(); // Hook pour écrire sur le contrat

  const handleRedeem = (miles) => {
    const amountInWei = parseEther(miles.toString()); // Converti MTK en wei (18 décimales)

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
        <Button isDisabled color="warning">
          Already Claimed
        </Button>
      );
    }
    return (
      <Button onPress={() => handleRedeem(miles)}> Claim {miles} MTK </Button>
    );
  }

  return (
    <div className="container">
      {isConnected && (
        <>
        <h1 className={styles.title}>
          Welcome to the AirFrance DApp
        </h1>
          {voyages.map((voyage, index) => {
            return (
              <Table key={index} aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>Trip</TableColumn>
                  <TableColumn>Departing</TableColumn>
                  <TableColumn>Return</TableColumn>
                  <TableColumn>Booking reference</TableColumn>
                  <TableColumn></TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {voyage.from} to {voyage.to}
                    </TableCell>
                    <TableCell>{voyage.departing}</TableCell>
                    <TableCell>{voyage.return}</TableCell>
                    <TableCell>{voyage.reference}</TableCell>
                    <TableCell>
                      <ClaimButton
                        isClaimed={voyage.hasBeenClaimed}
                        miles={voyage.miles}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Booking;
