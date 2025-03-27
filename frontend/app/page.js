'use client';
import NotConnected from "@/components/shared/NotConnected";
import Booking from "@/components/shared/Booking";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount()
  return (
    <>
      {isConnected ? (
        <Booking />
      ) : (
        <NotConnected />
      )}
    </>
  );
}