
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/Header.tsx';
import LandingPage from './pages/LandingPage.tsx'
import NFTInfo from './pages/NftInfo.jsx';
import TransferNft from './pages/TransferNft.jsx';
import Footer from './pages/Footer.tsx';
import Auction from './pages/Auction.tsx';
import PurchaseHistory from './pages/PurchaseHistory.jsx';
import NftGallery from './pages/NftGallery.tsx';
import MyNFTs from './pages/MyNFTs.tsx';
import AboutUs from './pages/AboutUs.tsx';
import BuyNow from './pages/BuyNow.jsx';
import MintNFT from './pages/MintNFT.tsx';
import { WalletProvider } from './components/context/WalletContext';
import { PurchaseProvider  } from './components/context/PurchaseContext';

function App() {
  return (
    <Router>
      <WalletProvider>
        <PurchaseProvider >
        <Header />

        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/NFTdetails" element={<NFTInfo />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/swap" element={<TransferNft />} />
          <Route path="/gallery" element={<NftGallery />} />
          <Route path="/mynfts" element={<MyNFTs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/buynow" element={<BuyNow />} />
          <Route path="/mintnft" element={<MintNFT />} />
        </Routes>
         
        <Footer />
      </PurchaseProvider >
      </WalletProvider>
    </Router>
  );
}

function HomeWrapper() {
  return (
    <>
    <div className='home-container'>
    </div>
      <LandingPage />
      <NftGallery />
    </>
  );
}

export default App;
