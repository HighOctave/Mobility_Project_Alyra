import "../../styles/airfrance.css";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="https://wwws.airfrance.fr/en/information/legal">Legal information</Link> |
        <Link href="https://wwws.airfrance.fr/en/information/legal/edito-psc">Privacy policy</Link> |
        <Link href="https://wwws.airfrance.fr/en/information/legal/accessibilite">Accessibility: Non-compliant</Link> |
        <Link href="/cookies">Cookie settings</Link>
      </div>
    </footer>
  );
};

export default Footer;
