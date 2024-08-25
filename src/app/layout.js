import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Single from './components/Single';


export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
        <link rel="shortcut icon" href="/images/fav.png" type="image/x-icon"></link>
        <link rel="stylesheet preload" href="/css/plugins/fontawesome-5.css" as="style"></link>
        <link rel="stylesheet preload" href="/css/vendor/bootstrap.min.css" as="style"></link>
        <link rel="stylesheet preload" href="/css/vendor/swiper.css" as="style"></link>
        <link rel="stylesheet preload" href="/css/vendor/metismenu.css" as="style"></link>
        <link rel="stylesheet preload" href="/css/vendor/magnific-popup.css" as="style"></link>
        <link rel="stylesheet preload" href="/css/style.css" as="style"></link>
        <body className="home-one">
        <Header />
        <Sidebar />

        {children}
        <Footer />
        </body>
    </html>
  );
}
