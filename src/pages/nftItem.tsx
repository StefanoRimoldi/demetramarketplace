import React from 'react';


interface NFT {
  imageUrl: string;
  title: string;
  [key: string]: any;
}

interface NFTItemProps {
  title: string;
  nfts: NFT[];
  renderDetails: (nft: NFT) => React.ReactNode;
}

const NFTItem: React.FC<NFTItemProps> = ({ title, nfts, renderDetails }) => (
  <div>
    <h2>{title}</h2>
    <div className="orders-list">
      {nfts.length > 0 ? (
        nfts.map((nft, index) => (
          <div className="order-item" key={index}>
            <img src={nft.imageUrl} alt={nft.title} className="order-image" />
            <div className="order-details">{renderDetails(nft)}</div>
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}
    </div>
  </div>
);

export default NFTItem;
