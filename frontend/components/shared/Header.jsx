import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Home.module.css";

const Header = () => {
  return (
      <div>
        <div className={styles.container}>
          <ConnectButton label="Connect your Wallet"/>
        </div>
        <h1 className={styles.title}>
          Welcome to the AirFrance DApp
        </h1>
      </div>
  );
};

export default Header;