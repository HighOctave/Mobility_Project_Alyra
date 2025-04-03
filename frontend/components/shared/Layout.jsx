import Header from "./Header";
import Footer from "./Footer";
import "../../styles/airfrance.css";

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
                <main className="main-content">
                    {children}
                </main>
            <Footer />
        </div>
    )
}

export default Layout;