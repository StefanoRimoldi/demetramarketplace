# Progetto Finale Start2Impact Blockchain e Ai - Demetra Marketplace
<a name="readme-top"></a>

## Introduzione

**Demetra Marketplace** è un’applicazione decentralizzata (dApp) pensata per supportare un’innovativa collezione di calzature realizzate con materiali bio ed ecosostenibili. Il progetto fonde sostenibilità e tecnologia, permettendo agli utenti di gestire e trasferire NFT su blockchain Ethereum, che rappresentano digitalmente ogni modello di scarpa. Grazie all’integrazione di React, TypeScript e librerie Web3, Demetra offre un’interfaccia intuitiva per visualizzare, selezionare e trasferire NFT in modo sicuro, promuovendo trasparenza, tracciabilità e un nuovo modo di vivere il prodotto fisico attraverso il digitale.

## Sommario

- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
  - [Clonazione della Repository](#clonazione-della-repository)
  - [Installazione delle Dipendenze](#installazione-delle-dipendenze)
  - [Avvio del Progetto](#avvio-del-progetto)
  - [Accedi all'applicazione](#accedi-allapplicazione)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Funzionalità](#funzionalità)
- [Smart Contracts](#smart-contracts)
- [Link Progetto](#link-progetto)
- [Contatti](#contatti)

## Prerequisiti

Prima di eseguire l'applicazione, assicurati di avere installati i seguenti strumenti:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

Puoi verificare se hai già questi strumenti con i seguenti comandi:

```bash
node -v
npm -v
```

## Installazione

### Clonazione della Repository

Clona il repository sul tuo sistema locale:

```bash
git clone https://github.com/tuo-username/demetramarketplace.git
cd demetramarketplace
```

### Installazione delle Dipendenze

Installa le dipendenze usando npm:

```bash
npm install
```
Oppure usando yarn:

```bash
yarn install
```
### Avvio del Progetto

Avvia il progetto in modalità sviluppo usando npm:

```bash
npm start
```
Oppure usando yarn:

```bash
yarn start
```

### Accedi all'applicazione

Apri il browser e vai all'indirizzo:

```bash
http://localhost:3000
```
## Tecnologie Utilizzate

- **React**: Libreria JavaScript per costruire interfacce utente.
- **TypeScript**: Superinsieme di JavaScript che aggiunge tipizzazione statica.
- **Ether.js**: Libreria per interagire con la blockchain di Ethereum, utilizzata per la gestione dei pagamenti e delle transazioni tramite smart contract.
- **Tailwind CSS**: Framework CSS per uno sviluppo rapido e altamente personalizzabile dello stile dell'applicazione.
- **Vercel / Netlify**: Piattaforme per il deployment dell’applicazione.

## Funzionalità

- **Galleria NFT**: l’applicazione presenta una gallery dinamica di tutte le scarpe in formato NFT, realizzate con materiali biologici e rappresentate digitalmente sulla blockchain. Ogni card mostra i dettagli dell’NFT e consente all’utente di acquistare o fare un’offerta.
- **My Collection**: pagina dedicata agli NFT posseduti dall’utente, con visualizzazione completa della propria collezione personale.
- **Auction**: sezione che mostra esclusivamente gli NFT attualmente all’asta, permettendo agli utenti di partecipare alle offerte.
- **Swap**: area per il trasferimento peer-to-peer degli NFT in proprio possesso. L’utente può selezionare un NFT e inviarlo a un altro indirizzo Ethereum in modo sicuro.
- **History**: pagina che raccoglie tutti i log di attività legati all’account, tra cui NFT acquistati, ricevuti, trasferiti o messaggi di conferma delle operazioni.
- **Mint**: pagina disponibile solo per il proprietario del contratto. Questa sezione permette di creare nuovi NFT caricando un’immagine, un titolo e una descrizione. Gli NFT mintati verranno inseriti nella gallery pubblica.
- **Interazione con Smart Contract**: l’applicazione utilizza smart contract per la gestione delle transazioni, delle aste e dei trasferimenti NFT, garantendo trasparenza e sicurezza grazie alla blockchain Ethereum.
- **Gestione del Wallet**: possibilità di connettere e disconnettere il wallet MetaMask direttamente dal sito.

Password di accesso alla pagina Mint: nft123

## SmartContracts

L’applicazione interagisce con diversi smart contract deployati sulla rete Ethereum (testnet Sepolia), ciascuno responsabile di una funzionalità specifica del marketplace:

- **BuyNow Contract**:
Gestisce l’acquisto diretto degli NFT.<br>
Indirizzo: 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
- **Auction Contract**:
Consente agli utenti di partecipare o avviare aste per gli NFT.<br>
Indirizzo: 0xf8e81D47203A594245E36C48e151709F0C19fBe8
- **Winner Contract**:
Al termine dell'asta viene mintato l'NFT al vincitore.<br>
Indirizzo: 0xC5818c2151c59eBbFFB157F49b85c3d916859D62
- **TransferNFT Contract**:
Permette il trasferimento di NFT da un utente a un altro.<br>
Indirizzo: 0xDA0bab807633f07f013f94DD0E6A4F96F8742B53
- **MintNFT Contract**
Responsabile del minting degli NFT all’interno della piattaforma.<br>
Indirizzo: 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47


## Realizzato con:
- Visual Studio Code
- Remix Ethereum IDE

## Link progetto:
- Repo GitHub: https://github.com/StefanoRimoldi/demetramarketplace.git
- Netlify: https://demetramarketplace.netlify.app/
- Vercel: https://demetramarketplace.vercel.app/


## Contatti
- Email: rimoldistefano@gmail.com
- Linkedin: www.linkedin.com/in/stefano-rimoldi

<p align="right">(<a href="#readme-top">back to top</a>)</p>


