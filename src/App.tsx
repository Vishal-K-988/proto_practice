import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from "react-dom";
import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import {
  Cpu,
  ArrowRight,
  Code,
  Layers,
  Wallet as WalletIcon,
  ChevronDown,
} from "lucide-react";

// Import components
import SmartContractChat from "./Component/chat";

import DeployedButton from "./Component/DeployedButton"
import DeployForm from "./Component/DeployForm";

function AppContent() {
  // Refs for scrolling
  const contractSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  const scrollToContractSection = () => {
    contractSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCTASection = () => {
    ctaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Wallet hook: get wallet data and methods.
  const { wallet, account, connect, disconnect, connected } = useWallet();

  const handleConnect = async () => {
    try {
      if (!connected) {
        await connect("Petra");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const handleCopyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account.address.toString());
        alert("Address copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <span className="text-xl font-bold">ProtoChain</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center" />
          <div className="flex items-center space-x-2">
            {/* Connect Wallet Button */}
            <button
              onClick={handleConnect}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                         ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
                         disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground
                         h-10 px-4 py-2"
            >
              <WalletIcon className="h-4 w-4" />
              {connected && account ? account.address.toString() : "Connect Wallet"}
            </button>
            {connected && account && (
              <>
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                             ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground
                             h-10 px-4 py-2"
                >
                  Copy Address
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                             ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground
                             h-10 px-4 py-2"
                >
                  Logout
                </button>
              </>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                         ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
                         disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90
                         h-10 px-4 py-2"
            >
              Documentation
            </button>
            {/* Deployed Button (navigates to /deploy) */}
            <DeployedButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Smart Contracts Made Simple
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Generate and deploy smart contracts with natural language prompts. No coding required.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={scrollToContractSection}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                               ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                               bg-primary text-primary-foreground hover:bg-primary/90
                               h-10 px-4 py-2 w-full"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={scrollToCTASection}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                               ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                               border border-input bg-background hover:bg-accent hover:text-accent-foreground
                               h-10 px-4 py-2 w-full"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contract Generator Section */}
        <section ref={contractSectionRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Create Smart Contracts in Seconds
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Describe - Select Wallet - Generate - Deploy
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-3xl">
              <div className="rounded-lg bg-card text-card-foreground border shadow-lg">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Generate Your Smart Contract
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Describe the functionality you need
                  </p>
                </div>
                <SmartContractChat />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    How it Works :)
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    ProtoChain simplifies the entire process from idea to deployed smart contract in
                    just simple three steps.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Select Your Wallet",
                      description: "Aptos - Petra  \n Etherium, Polygon - Metamask"
                    },
                    {
                      title: "Describe Your Contract",
                      description: "Use natural language to describe what you want your smart contract to do.",
                    },
                    {
                      title: "Select Your Blockchain",
                      description: "Choose between Aptos, Polygon, or other supported blockchains.",
                    },
                    {
                      title: "Deploy With One Click",
                      description: "Connect your wallet and deploy your contract directly to the blockchain.",
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="How ProtoChain works"
                  className="rounded-lg object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features That Make the Difference
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ProtoChain combines powerful technology with an intuitive interface to make smart
                contract development accessible to everyone.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Code className="h-10 w-10 text-primary" />,
                  title: "AI-Powered Generation",
                  description: "Our advanced AI understands your requirements and generates secure, optimized smart contract code.",
                },
                {
                  icon: <Layers className="h-10 w-10 text-primary" />,
                  title: "Multi-Chain Support",
                  description: "Deploy to multiple blockchains including Aptos and Polygon with the same simple interface.",
                },
                {
                  icon: <WalletIcon className="h-10 w-10 text-primary" />,
                  title: "Seamless Wallet Integration",
                  description: "Connect your preferred wallet for a smooth deployment experience with maximum security.",
                },
              ].map((feature, index) => (
                <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    {feature.icon}
                    <h3 className="text-2xl font-semibold leading-none tracking-tight mt-4">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaSectionRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Build More?
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <b>Create</b> and <b>Deploy</b> your frontend applications in real time with <b>Low-Code</b>.
                <br />
                Harness <b>AI</b> to optimize code, streamline workflows, and accelerate innovation.
                <br />
                Leverage <b>Web3</b> for secure, decentralized solutions that redefine the modern web.
              </p>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium
                           ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                           bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 mt-4"
              >
                Build
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">IGRIS</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET,
      }}
      optInWallets={["Petra"]}
      onError={(error: Error) => {
        console.error("Wallet adapter error:", error);
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/deploy" element={<DeployForm />} />
        </Routes>
      </Router>
    </AptosWalletAdapterProvider>
  );
}

export default App;

// Typically rendered in index.jsx with createRoot()
