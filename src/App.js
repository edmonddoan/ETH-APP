import { ethers } from 'ethers';
import TokenArtifact from './artifacts/contracts/Token.sol/Token.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
        const contract = new ethers.Contract(
          contractAddress,
          TokenArtifact.abi,
          signer
        );
        
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
} 