import "../../styles/airfrance.css";

const Footer = () => {
  return (
    <footer role="contentinfo">
      <bwc-legal-footer className="bwc-typo-body-l-regular ng-star-inserted">
        <div className="bwc-legal-footer bwc-page-layout__extra-large ng-star-inserted">
          <ul className="bwc-legal-footer__list bwc-page-layout__medium">
            <li className="bwc-legal-footer__item ng-star-inserted">
              <a
                className="bwc-legal-footer__link ng-star-inserted"
                href="/en/information/legal"
                target="_self"
              >
                Legal information
              </a>
            </li>
            <li className="bwc-legal-footer__item ng-star-inserted">
              <a
                className="bwc-legal-footer__link ng-star-inserted"
                href="/en/information/legal/edito-psc"
                target="_self"
              >
                Privacy policy
              </a>
            </li>
            <li className="bwc-legal-footer__item ng-star-inserted">
              <a
                className="bwc-legal-footer__link ng-star-inserted"
                href="/en/information/legal/accessibilite"
                target="_self"
              >
                Accessibility: Non-compliant
              </a>
            </li>
            <li className="bwc-legal-footer__item ng-star-inserted">
              <a href="#" className="bwc-legal-footer__link ng-star-inserted">
                Cookie settings
              </a>
            </li>
          </ul>
        </div>
      </bwc-legal-footer>
    </footer>
  );
};

export default Footer;
