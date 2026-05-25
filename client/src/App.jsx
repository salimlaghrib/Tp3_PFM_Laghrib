import React, { useEffect, useMemo, useState } from "react";
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Web3 from "web3";
import Exercice1Addition from "./contracts/Exercice1Addition.json";
import Exercice2Conversion from "./contracts/Exercice2Conversion.json";
import Exercice3GestionChaines from "./contracts/Exercice3GestionChaines.json";
import Exercice4NombrePositif from "./contracts/Exercice4NombrePositif.json";
import Exercice5Parite from "./contracts/Exercice5Parite.json";
import Exercice6ListeNombres from "./contracts/Exercice6ListeNombres.json";
import Rectangle from "./contracts/Rectangle.json";
import Payment from "./contracts/Payment.json";

const ganacheUrl = "http://127.0.0.1:7545";

const artifacts = {
  addition: Exercice1Addition,
  conversion: Exercice2Conversion,
  chaines: Exercice3GestionChaines,
  positif: Exercice4NombrePositif,
  parite: Exercice5Parite,
  liste: Exercice6ListeNombres,
  rectangle: Rectangle,
  payment: Payment,
};

const exercises = [
  ["ex1", "Exercice 1", "Addition", "Operations arithmetiques"],
  ["ex2", "Exercice 2", "Conversion Ether / Wei", "Unites Ethereum"],
  ["ex3", "Exercice 3", "Gestion des chaines", "Strings Solidity"],
  ["ex4", "Exercice 4", "Nombre positif", "Conditions"],
  ["ex5", "Exercice 5", "Parite", "Modulo"],
  ["ex6", "Exercice 6", "Liste de nombres", "Tableaux"],
  ["ex7", "Exercice 7", "Forme Rectangle", "Heritage"],
  ["ex8", "Exercice 8", "Payment", "Transactions ETH"],
];

function getContract(web3, artifact, networkId) {
  const deployedNetwork = artifact.networks?.[networkId];
  if (!deployedNetwork?.address) {
    throw new Error(`Contrat non deploie sur le reseau ${networkId}`);
  }
  return new web3.eth.Contract(artifact.abi, deployedNetwork.address);
}

function Field({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        min={min}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Result({ children }) {
  return <div className="result">{children || "Resultat en attente"}</div>;
}

function Home() {
  return (
    <section className="home-section">
      <div className="panel intro-panel">
        <p className="eyebrow">Blockchain et Web3</p>
        <h2>Sommaire du projet</h2>
        <p className="intro-text">
          Interface claire pour tester les 8 contrats Solidity du TP 3. Chaque exercice possede
          sa page, ses formulaires, son resultat, les informations blockchain et les details de
          la derniere transaction.
        </p>
        <div className="exercise-list">
          {exercises.map(([key, label, title, description], index) => (
            <Link className="exercise-link" to={`/${key}`} key={key}>
              <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <span>{title}</span>
              <small>{description}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlockchainInfo({ info }) {
  return (
    <article className="info-card">
      {/* <h3>Informations blockchain</h3> */}
      <dl>
        <div>
          <dt>Mode de connexion</dt>
          <dd>{info.connectionMode || "-"}</dd>
        </div>
        <div>
          <dt>Reseau</dt>
          <dd>{info.networkId || "-"}</dd>
        </div>
        <div>
          <dt>Chain ID</dt>
          <dd>{info.chainId || "-"}</dd>
        </div>
        <div>
          <dt>Dernier bloc</dt>
          <dd>{info.latestBlock || "-"}</dd>
        </div>
        <div>
          <dt>Hash du bloc</dt>
          <dd>{info.latestBlockHash || "-"}</dd>
        </div>
        <div>
          <dt>Date du bloc</dt>
          <dd>{info.latestBlockDate || "-"}</dd>
        </div>
        <div>
          <dt>Transactions du bloc</dt>
          <dd>{info.latestBlockTxCount || "-"}</dd>
        </div>
        <div>
          <dt>Gas price</dt>
          <dd>{info.gasPrice || "-"}</dd>
        </div>
        <div>
          <dt>Compte connecte</dt>
          <dd>{info.account || "-"}</dd>
        </div>
        <div>
          <dt>Solde</dt>
          <dd>{info.balance || "-"}</dd>
        </div>
        <div>
          <dt>Contrats charges</dt>
          <dd>{info.contractsLoaded || "-"}</dd>
        </div>
      </dl>
    </article>
  );
}

function TransactionInfo({ tx }) {
  return (
    <article className="info-card">
      <h3>Derniere transaction</h3>
      {tx ? (
        <dl>
          <div>
            <dt>Hash</dt>
            <dd>{tx.transactionHash}</dd>
          </div>
          <div>
            <dt>Bloc</dt>
            <dd>{String(tx.blockNumber)}</dd>
          </div>
          <div>
            <dt>Expediteur</dt>
            <dd>{tx.from || "-"}</dd>
          </div>
          <div>
            <dt>Destinataire</dt>
            <dd>{tx.to || tx.contractAddress || "-"}</dd>
          </div>
          <div>
            <dt>Gas utilise</dt>
            <dd>{String(tx.gasUsed)}</dd>
          </div>
          <div>
            <dt>Gas cumule</dt>
            <dd>{String(tx.cumulativeGasUsed || "-")}</dd>
          </div>
          <div>
            <dt>Prix effectif du gas</dt>
            <dd>{tx.effectiveGasPrice ? `${tx.effectiveGasPrice} Wei` : "-"}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd>{tx.status ? "Succes" : "Echec"}</dd>
          </div>
        </dl>
      ) : (
        <p className="muted">Aucune transaction executee depuis l'ouverture de la dApp.</p>
      )}
    </article>
  );
}

function ExerciseLayout({ title, blockchainInfo, lastTx, children }) {
  return (
    <section className="workspace">
      <div className="panel exercise-panel">
        <div className="exercise-header">
          <Link className="summary-link" to="/">
            Sommaire
          </Link>
          <div>
            <p className="eyebrow">Page exercice</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="exercise-content">
          {children}
        </div>
        <section className="monitoring-section" aria-label="Suivi blockchain et transaction">
          <div className="section-heading">
            <h2>Informations blockchain</h2>
          </div>
          <div className="monitoring-grid">
            <BlockchainInfo info={blockchainInfo} />
            <TransactionInfo tx={lastTx} />
          </div>
        </section>
      </div>
    </section>
  );
}

function Dapp() {
  const [web3State, setWeb3State] = useState({
    web3: null,
    accounts: [],
    contracts: {},
    networkId: "",
    connectionMode: "",
    loading: true,
    error: "",
  });
  const [blockchainInfo, setBlockchainInfo] = useState({
    connectionMode: "",
    networkId: "",
    chainId: "",
    latestBlock: "",
    latestBlockHash: "",
    latestBlockDate: "",
    latestBlockTxCount: "",
    gasPrice: "",
    account: "",
    balance: "",
    contractsLoaded: "",
  });
  const [lastTx, setLastTx] = useState(null);

  const [ex1, setEx1] = useState({ n1: "10", n2: "15", p1: "3", p2: "7", result: "" });
  const [ex2, setEx2] = useState({ ether: "1", wei: "1000000000000000000", result: "" });
  const [ex3, setEx3] = useState({
    message: "",
    nextMessage: "Bonjour React",
    a: "Solidity ",
    b: "Web3",
    avec: " + React",
    longueur: "Blockchain",
    compA: "test",
    compB: "test",
    result: "",
  });
  const [ex4, setEx4] = useState({ nombre: "5", result: "" });
  const [ex5, setEx5] = useState({ nombre: "8", result: "" });
  const [ex6, setEx6] = useState({ nombre: "10", index: "0", tableau: "", somme: "", element: "" });
  const [ex7, setEx7] = useState({ x: "2", y: "3", xy: "", infos: "", dimensions: "", surface: "" });
  const [ex8, setEx8] = useState({ amount: "0.1", recipient: "", balance: "", result: "" });

  const { web3, accounts, contracts, networkId, connectionMode, loading, error } = web3State;
  const account = accounts[0] || "";
  const location = useLocation();
  const route = location.pathname === "/" ? "home" : location.pathname.replace("/", "");

  const titleByRoute = useMemo(() => Object.fromEntries(exercises.map(([key, label, title]) => [key, `${label} - ${title}`])), []);

  useEffect(() => {
    async function init() {
      try {
        const hasMetaMask = Boolean(window.ethereum);
        const provider = hasMetaMask ? window.ethereum : new Web3.providers.HttpProvider(ganacheUrl);
        const instance = new Web3(provider);

        if (hasMetaMask) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
        }

        const currentNetworkId = await instance.eth.net.getId();
        const currentAccounts = await instance.eth.getAccounts();
        const loadedContracts = Object.fromEntries(
          Object.entries(artifacts).map(([key, artifact]) => [
            key,
            getContract(instance, artifact, currentNetworkId),
          ])
        );

        setWeb3State({
          web3: instance,
          accounts: currentAccounts,
          contracts: loadedContracts,
          networkId: String(currentNetworkId),
          connectionMode: hasMetaMask ? "MetaMask" : "Ganache HTTP",
          loading: false,
          error: "",
        });
      } catch (initError) {
        setWeb3State((current) => ({
          ...current,
          loading: false,
          error:
            "Impossible de charger les contrats. Lancez Ganache sur 127.0.0.1:7545 puis executez truffle migrate --reset dans Tp3_PFM.",
        }));
      }
    }

    init();
  }, []);

  useEffect(() => {
    async function refreshBlockchainInfo() {
      if (!web3 || !account) {
        return;
      }

      const [latestBlock, chainId, gasPrice, balance] = await Promise.all([
        web3.eth.getBlockNumber(),
        web3.eth.getChainId(),
        web3.eth.getGasPrice(),
        web3.eth.getBalance(account),
      ]);
      const block = await web3.eth.getBlock(latestBlock);
      const blockTimestamp = block?.timestamp ? Number(block.timestamp) * 1000 : 0;

      setBlockchainInfo({
        connectionMode,
        networkId,
        latestBlock: String(latestBlock),
        chainId: String(chainId),
        latestBlockHash: block?.hash || "-",
        latestBlockDate: blockTimestamp ? new Date(blockTimestamp).toLocaleString() : "-",
        latestBlockTxCount: String(block?.transactions?.length || 0),
        gasPrice: `${Number(web3.utils.fromWei(gasPrice, "gwei")).toFixed(2)} Gwei`,
        account,
        balance: `${Number(web3.utils.fromWei(balance, "ether")).toFixed(4)} ETH`,
        contractsLoaded: `${Object.keys(contracts).length} / 8`,
      });
    }

    refreshBlockchainInfo();
  }, [web3, account, networkId, connectionMode, contracts, lastTx]);

  useEffect(() => {
    async function loadInitialData() {
      if (!contracts.chaines || !contracts.liste || !contracts.rectangle || !contracts.payment || !web3) {
        return;
      }

      const [message, tableau, somme, xy, infos, dimensions, surface, recipient, balance] =
        await Promise.all([
          contracts.chaines.methods.getMessage().call(),
          contracts.liste.methods.afficheTableau().call(),
          contracts.liste.methods.calculerSomme().call(),
          contracts.rectangle.methods.afficheXY().call(),
          contracts.rectangle.methods.afficheInfos().call(),
          contracts.rectangle.methods.afficheLoLa().call(),
          contracts.rectangle.methods.surface().call(),
          contracts.payment.methods.recipient().call(),
          contracts.payment.methods.getBalance().call(),
        ]);

      setEx3((current) => ({ ...current, message }));
      setEx6((current) => ({ ...current, tableau: tableau.join(", "), somme: String(somme) }));
      setEx7((current) => ({
        ...current,
        xy: `x = ${xy[0]}, y = ${xy[1]}`,
        infos,
        dimensions: `longueur = ${dimensions[0]}, largeur = ${dimensions[1]}`,
        surface: String(surface),
      }));
      setEx8((current) => ({
        ...current,
        recipient,
        balance: `${web3.utils.fromWei(balance, "ether")} ETH`,
      }));
    }

    loadInitialData();
  }, [contracts, web3]);

  async function sendTransaction(callback) {
    const receipt = await callback();
    setLastTx(receipt);
    return receipt;
  }

  async function refreshListe() {
    const [tableau, somme] = await Promise.all([
      contracts.liste.methods.afficheTableau().call(),
      contracts.liste.methods.calculerSomme().call(),
    ]);
    setEx6((current) => ({ ...current, tableau: tableau.join(", "), somme: String(somme) }));
  }

  async function refreshPayment() {
    const balance = await contracts.payment.methods.getBalance().call();
    setEx8((current) => ({ ...current, balance: `${web3.utils.fromWei(balance, "ether")} ETH` }));
  }

  const disabled = loading || Boolean(error);

  function renderExercise() {
    if (route === "home") {
      return <Home />;
    }

    return (
      <ExerciseLayout title={titleByRoute[route]} blockchainInfo={blockchainInfo} lastTx={lastTx}>
        {route === "ex1" && (
          <>
            <div className="grid">
              <Field label="Nombre 1" type="number" value={ex1.n1} onChange={(n1) => setEx1({ ...ex1, n1 })} />
              <Field label="Nombre 2" type="number" value={ex1.n2} onChange={(n2) => setEx1({ ...ex1, n2 })} />
            </div>
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  await sendTransaction(() => contracts.addition.methods.setNombres(ex1.n1, ex1.n2).send({ from: account }));
                  const result = await contracts.addition.methods.addition1().call();
                  setEx1({ ...ex1, result: `addition1 = ${result}` });
                }}
              >
                Calculer addition1
              </button>
            </div>
            <div className="grid">
              <Field label="Parametre A" type="number" value={ex1.p1} onChange={(p1) => setEx1({ ...ex1, p1 })} />
              <Field label="Parametre B" type="number" value={ex1.p2} onChange={(p2) => setEx1({ ...ex1, p2 })} />
            </div>
            <button
              disabled={disabled}
              onClick={async () => {
                const result = await contracts.addition.methods.addition2(ex1.p1, ex1.p2).call();
                setEx1({ ...ex1, result: `addition2 = ${result}` });
              }}
            >
              Calculer addition2
            </button>
            <Result>{ex1.result}</Result>
          </>
        )}

        {route === "ex2" && (
          <>
            <div className="grid">
              <Field label="Montant en Ether" type="number" min="0" value={ex2.ether} onChange={(ether) => setEx2({ ...ex2, ether })} />
              <Field label="Montant en Wei" type="number" min="0" value={ex2.wei} onChange={(wei) => setEx2({ ...ex2, wei })} />
            </div>
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.conversion.methods.etherEnWei(ex2.ether).call();
                  setEx2({ ...ex2, result: `${ex2.ether} ETH = ${result} Wei` });
                }}
              >
                Ether vers Wei
              </button>
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.conversion.methods.weiEnEther(ex2.wei).call();
                  setEx2({ ...ex2, result: `${ex2.wei} Wei = ${result} ETH` });
                }}
              >
                Wei vers Ether
              </button>
            </div>
            <Result>{ex2.result}</Result>
          </>
        )}

        {route === "ex3" && (
          <>
            <Result>Message actuel: {ex3.message || "-"}</Result>
            <Field label="Nouveau message" value={ex3.nextMessage} onChange={(nextMessage) => setEx3({ ...ex3, nextMessage })} />
            <button
              disabled={disabled}
              onClick={async () => {
                await sendTransaction(() => contracts.chaines.methods.setMessage(ex3.nextMessage).send({ from: account }));
                const message = await contracts.chaines.methods.getMessage().call();
                setEx3({ ...ex3, message, result: "Message modifie" });
              }}
            >
              Modifier le message
            </button>
            <div className="grid">
              <Field label="Chaine A" value={ex3.a} onChange={(a) => setEx3({ ...ex3, a })} />
              <Field label="Chaine B" value={ex3.b} onChange={(b) => setEx3({ ...ex3, b })} />
            </div>
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.chaines.methods.concatener(ex3.a, ex3.b).call();
                  setEx3({ ...ex3, result });
                }}
              >
                Concatener A + B
              </button>
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.chaines.methods.concatenerAvec(ex3.avec).call();
                  setEx3({ ...ex3, result });
                }}
              >
                Concatener avec message
              </button>
            </div>
            <div className="grid">
              <Field label="Texte a mesurer" value={ex3.longueur} onChange={(longueur) => setEx3({ ...ex3, longueur })} />
              <Field label="Comparaison A" value={ex3.compA} onChange={(compA) => setEx3({ ...ex3, compA })} />
              <Field label="Comparaison B" value={ex3.compB} onChange={(compB) => setEx3({ ...ex3, compB })} />
            </div>
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.chaines.methods.longueur(ex3.longueur).call();
                  setEx3({ ...ex3, result: `Longueur = ${result}` });
                }}
              >
                Longueur
              </button>
              <button
                disabled={disabled}
                onClick={async () => {
                  const result = await contracts.chaines.methods.comparer(ex3.compA, ex3.compB).call();
                  setEx3({ ...ex3, result: result ? "Chaines identiques" : "Chaines differentes" });
                }}
              >
                Comparer
              </button>
            </div>
            <Result>{ex3.result}</Result>
          </>
        )}

        {route === "ex4" && (
          <>
            <Field label="Nombre" type="number" value={ex4.nombre} onChange={(nombre) => setEx4({ ...ex4, nombre })} />
            <button
              disabled={disabled}
              onClick={async () => {
                const result = await contracts.positif.methods.estPositif(ex4.nombre).call();
                setEx4({ ...ex4, result: result ? "Le nombre est positif" : "Le nombre n'est pas positif" });
              }}
            >
              Verifier
            </button>
            <Result>{ex4.result}</Result>
          </>
        )}

        {route === "ex5" && (
          <>
            <Field label="Nombre" type="number" min="0" value={ex5.nombre} onChange={(nombre) => setEx5({ ...ex5, nombre })} />
            <button
              disabled={disabled}
              onClick={async () => {
                const result = await contracts.parite.methods.estPair(ex5.nombre).call();
                setEx5({ ...ex5, result: result ? "Le nombre est pair" : "Le nombre est impair" });
              }}
            >
              Verifier
            </button>
            <Result>{ex5.result}</Result>
          </>
        )}

        {route === "ex6" && (
          <>
            <Result>Tableau: [{ex6.tableau}] | Somme: {ex6.somme || "-"}</Result>
            <div className="grid">
              <Field label="Nombre a ajouter" type="number" min="0" value={ex6.nombre} onChange={(nombre) => setEx6({ ...ex6, nombre })} />
              <Field label="Index a lire" type="number" min="0" value={ex6.index} onChange={(index) => setEx6({ ...ex6, index })} />
            </div>
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  await sendTransaction(() => contracts.liste.methods.ajouterNombre(ex6.nombre).send({ from: account }));
                  await refreshListe();
                }}
              >
                Ajouter
              </button>
              <button
                disabled={disabled}
                onClick={async () => {
                  const element = await contracts.liste.methods.getElement(ex6.index).call();
                  setEx6((current) => ({ ...current, element: `Element ${ex6.index} = ${element}` }));
                }}
              >
                Lire element
              </button>
              <button disabled={disabled} onClick={refreshListe}>
                Actualiser
              </button>
            </div>
            <Result>{ex6.element}</Result>
          </>
        )}

        {route === "ex7" && (
          <>
            <Result>{ex7.infos} | {ex7.xy} | {ex7.dimensions} | Surface: {ex7.surface || "-"}</Result>
            <div className="grid">
              <Field label="Nouvelle coordonnee x" type="number" min="0" value={ex7.x} onChange={(x) => setEx7({ ...ex7, x })} />
              <Field label="Nouvelle coordonnee y" type="number" min="0" value={ex7.y} onChange={(y) => setEx7({ ...ex7, y })} />
            </div>
            <button
              disabled={disabled}
              onClick={async () => {
                await sendTransaction(() => contracts.rectangle.methods.deplacerForme(ex7.x, ex7.y).send({ from: account }));
                const [xy, surface] = await Promise.all([
                  contracts.rectangle.methods.afficheXY().call(),
                  contracts.rectangle.methods.surface().call(),
                ]);
                setEx7({ ...ex7, xy: `x = ${xy[0]}, y = ${xy[1]}`, surface: String(surface) });
              }}
            >
              Deplacer
            </button>
          </>
        )}

        {route === "ex8" && (
          <>
            <Result>Destinataire: {ex8.recipient || "-"} | Solde contrat: {ex8.balance || "-"}</Result>
            <Field label="Montant a envoyer en ETH" type="number" min="0" value={ex8.amount} onChange={(amount) => setEx8({ ...ex8, amount })} />
            <div className="actions">
              <button
                disabled={disabled}
                onClick={async () => {
                  await sendTransaction(() =>
                    contracts.payment.methods.receivePayment().send({
                      from: account,
                      value: web3.utils.toWei(ex8.amount, "ether"),
                    })
                  );
                  await refreshPayment();
                  setEx8((current) => ({ ...current, result: "Paiement envoye" }));
                }}
              >
                Envoyer le paiement
              </button>
              <button
                disabled={disabled}
                onClick={async () => {
                  await sendTransaction(() => contracts.payment.methods.withdraw().send({ from: account }));
                  await refreshPayment();
                  setEx8((current) => ({ ...current, result: "Retrait effectue" }));
                }}
              >
                Retirer
              </button>
              <button disabled={disabled} onClick={refreshPayment}>
                Actualiser
              </button>
            </div>
            <Result>{ex8.result}</Result>
          </>
        )}
      </ExerciseLayout>
    );
  }

  return (
    <main className="app-shell">
      <section className="institution-strip" aria-label="Logos institutionnels">
        <div className="brand-card brand-card-wide">
          <img src="/logo-faculte-officiel.png" alt="Universite Moulay Ismail - Faculte des Sciences et Techniques" />
        </div>
        <div className="brand-card brand-card-wide brand-card-light">
          <img src="/logo-ilia-officiel.jpeg" alt="Logo filiere CI-ILIA" />
        </div>
      </section>

      <section className="topbar">
        <div>
          <p className="eyebrow">Projet fin de module</p>
          <h1>dApp React et Web3 pour le TP 3 Solidity</h1>
          <div className="hero-tags" aria-label="Technologies utilisees">
            <span>Solidity</span>
            <span>Truffle</span>
            <span>Ganache</span>
            <span>React</span>
            <span>Web3.js</span>
          </div>
        </div>
        <div className="status">
          <span>Ganache: {ganacheUrl}</span>
          <span>Reseau: {networkId || "-"}</span>
          <span>Compte: {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "-"}</span>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <nav className="tabs" aria-label="Navigation">
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/" end>
          Sommaire
        </NavLink>
        {exercises.map(([key, label]) => (
          <NavLink key={key} className={({ isActive }) => (isActive ? "active" : "")} to={`/${key}`}>
            {label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={renderExercise()} />
        {exercises.map(([key]) => (
          <Route path={`/${key}`} element={renderExercise()} key={key} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      <Dapp />
    </HashRouter>
  );
}

export default App;
