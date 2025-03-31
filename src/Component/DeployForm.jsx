import React, { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useLocation } from 'react-router-dom';
import { Cpu } from "lucide-react";
import { AptosClient } from 'aptos';
// Import SyntaxHighlighter and the theme
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Helper function to parse a markdown code block.
function parseCodeBlock(text) {
  const regex = /```(\w+)\n([\s\S]*?)```/;
  const match = regex.exec(text);
  if (match) {
    return { language: match[1], code: match[2] };
  }
  // Default to "move" if no language is specified.
  return { language: 'move', code: text };
}

export default function DeployForm() {
  const { account, connected, signTransaction } = useWallet();
  const { state } = useLocation();
  const [gasPrice, setGasPrice] = useState('');
  const [txId, setTxId] = useState('N/A');
  const [contract, setContract] = useState('');

  // Set contract from navigation state.
  useEffect(() => {
    if (state && state.contract) {
      setContract(state.contract);
    }
  }, [state]);

  // Simulate real-time gas price calculation.
  useEffect(() => {
    const interval = setInterval(() => {
      setGasPrice((100 + Math.floor(Math.random() * 10)).toString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      alert("Please sign the transaction in your wallet.");

      const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

      const payload = {
        type: "script_function_payload",
        function: "0x1::code::publish_package",
        type_arguments: [],
        arguments: [contract]
      };

      const txnRequest = await client.generateTransaction(account.address, payload);
      const signedTxn = await signTransaction(txnRequest);
      const txResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txResult.hash);
      setTxId(txResult.hash);
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed: " + error.message);
    }
  };

  // Parse the contract code for syntax highlighting.
  const { language, code } = parseCodeBlock(contract);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <span className="text-xl font-bold">ProtoChain</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Deploy Smart Contract</h2>
          <div className="grid gap-6 py-6">
            <div className="rounded-lg border border-border bg-muted/5 p-4">
              <h4 className="font-medium text-sm mb-2">User's Public Key</h4>
              <p className="text-sm text-muted-foreground font-mono bg-background/50 p-2 rounded">
                {connected && account ? account.address.toString() : "Not Connected"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/5 p-4">
              <h4 className="font-medium text-sm mb-2">Gas Price (IN REAL-TIME -- 5s)</h4>
              <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                {gasPrice || "Calculating..."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/5 p-4">
              <h4 className="font-medium text-sm mb-2">Transaction ID</h4>
              <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                {txId}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/5 p-4">
              <h4 className="font-medium text-sm mb-2">Contract Code</h4>
              {/* Render the contract code using SyntaxHighlighter */}
              <SyntaxHighlighter
                language={language}
                style={atomOneDark}
                customStyle={{ borderRadius: '0.375rem', border: '1px solid #4B5563', padding: '1rem', backgroundColor: 'black' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="flex justify-center pt-4 border-t border-border">
            <button
              onClick={handleDeploy}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                         ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                         bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2"
            >
              Deploy Contract
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">IGRIS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
