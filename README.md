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
Gestisce l’acquisto diretto degli NFT.
Indirizzo: 
- **Auction Contract**:
Consente agli utenti di partecipare o avviare aste per gli NFT.
Indirizzo: 0x321997fF247410A2053F386FCc49207B8343c7d3
- **TransferNFT Contract**:
Permette il trasferimento di NFT da un utente a un altro.
Indirizzo: 0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c
- **MintNFT Contract**
Responsabile del minting degli NFT all’interno della piattaforma.
Indirizzo: 0x0fC5025C764cE34df352757e82f7B5c4Df39A836


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


