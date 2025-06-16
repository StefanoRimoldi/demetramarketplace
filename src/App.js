
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.tsx';
import LandingPage from './components/LandingPage.tsx'
import NFTInfo from './components/NftInfo.jsx';
import TransferNft from './pages/TransferNft.jsx';
import Footer from './components/Footer.tsx';
import Auction from './pages/Auction.tsx';
import PurchaseHistory from './pages/PurchaseHistory.jsx';
import NftGallery from './components/NftGallery.tsx';
import MyNFTs from './components/MyNFTs.tsx';
import AboutUs from './pages/AboutUs.tsx';
import BuyNow from './pages/BuyNow.jsx';
import MintNFT from './pages/MintNFT.tsx';
import { WalletProvider } from './context/WalletContext.jsx';
import { PurchaseProvider  } from './context/PurchaseContext.jsx';

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
