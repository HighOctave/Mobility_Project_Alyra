import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';
import Image from 'next/image';
import bookingstyles from "../../styles/Booking.module.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Image src="/images/brand-logo.svg" alt="Airline Logo" width={300} height={20} />
      </div>
      
      <nav className="nav-menu">
        <Link href="/">Book a flight</Link>
        <Link href="/">Check-in</Link>
        <Link href="/" className={bookingstyles.activeLink}>My Bookings</Link>
        <Link href="/">Information</Link>
        <Link href="/">Support</Link>
      </nav>

      <div className="auth-section">
      <ConnectButton label="Connect your Wallet" chainStatus="icon" showBalance={false}/>
      <Image src="/images/loggedIn.png" alt="DAVID SANOU" width={246} height={20} />
      </div>
    </header>
  );
};

export default Header;
