import { SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { ethers as ethers6 } from 'ethers'
import * as ethers5 from 'ethers5'

function App() {
  // Use ethers v6 BrowserProvider instead of v5 Web3Provider
  // Update provider initialization for ethers v6
  const provider = new ethers6.BrowserProvider(window.ethereum)

  // JSON-RPC endpoints - replace with your own Infura/Alchemy keys
  const jsonRpcEndpoint = {
    11155111: ['https://eth-sepolia.g.alchemy.com/v2/']
  }

  // Define token list for BAM token
  const MY_TOKEN_LIST = [
    {
      name: "BamBam",
      address: "0x1a12119907BAE25869EcDC623a5CFEE60007938F", // Replace with your token address
      symbol: "BAM",
      decimals: 18,
      chainId: 11155111, // Sepolia chainId
      logoURI: "" // Add your token logo URL if available
    }
  ]

  return (
    <div className="App">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <SwapWidget
          provider={provider}
          jsonRpcEndpoint={jsonRpcEndpoint}
          tokenList={MY_TOKEN_LIST}
          width={360}
          defaultInputTokenAddress="NATIVE" // ETH
          defaultOutputTokenAddress={MY_TOKEN_LIST[0].address} // BAM token
        />
      </div>
    </div>
  )
}

export default App