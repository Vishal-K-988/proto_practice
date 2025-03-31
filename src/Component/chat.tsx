import React, { useRef, useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useNavigate } from 'react-router-dom';
import './chat.css';

// Helper function to parse a markdown code block from the response.
function parseCodeBlock(text) {
  const regex = /```(\w+)\n([\s\S]*?)```/;
  const match = regex.exec(text);
  if (match) {
    return { language: match[1], code: match[2] };
  }
  return { language: null, code: text };
}

export default function SmartContractChat() {
  const outputRef = useRef(null);
  const navigate = useNavigate();

  // Manage prompt, blockchain selection, loading, and generated response.
  const [input, setInput] = useState("");
  const [blockchain, setBlockchain] = useState("Aptos");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = "auto";
      outputRef.current.style.height = `${outputRef.current.scrollHeight}px`;
    }
  }, [response]);

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    let fullResponse = "";
    try {
      const languageForInstruction = blockchain === "Aptos" ? "Move" : "Solidity";
      const systemInstruction = `You are a smart contract generator. The user wants to generate a smart contract for the ${blockchain} blockchain using ${languageForInstruction}. Generate a fully functional smart contract code based on the given prompt.`;

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction,
      });

      const chat = model.startChat({
        history: [{ role: "user", parts: [{ text: input }] }],
      });

      const result = await chat.sendMessageStream(input);
      for await (const chunk of result.stream) {
        fullResponse += chunk.text();
      }
      setResponse(fullResponse);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while fetching response.");
    } finally {
      setLoading(false);
    }
  }

  // Parse code block (if any)
  const { language, code } = parseCodeBlock(response);

  // When "Deployed" is clicked, navigate to the deploy page with contract and blockchain in state.
  const handleDeployClick = () => {
    navigate('/deploy', { state: { contract: response, blockchain } });
  };

  return (
    <div>
      {/* Input Section */}
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3
                       ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-24 resize-none py-4 text-base"
            placeholder="Ask AI to build..  "
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <div className="relative">
                <select
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input
                             bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none
                             focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
                >
                  <option>Aptos</option>
                  <option>Polygon</option>
                  <option>Ethereum</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                         ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
                         disabled:opacity-50 h-10 px-4 py-2 flex-1 gap-2 ${
                           loading ? 'bg-black text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                         }`}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Generate Contract
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">Generated Smart Contract:</h2>
          {language ? (
            <SyntaxHighlighter 
              language={language} 
              style={atomOneDark} 
              customStyle={{ borderRadius: '0.375rem', border: '1px solid #4B5563', padding: '1rem', backgroundColor: 'black' }}
            >
              {code}
            </SyntaxHighlighter>
          ) : (
            <textarea
              ref={outputRef}
              readOnly
              value={response}
              className="bg-black text-white p-4 rounded border border-gray-600 w-full overflow-hidden resize-none"
              style={{ backgroundColor: 'black', color: 'white' }}
            />
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([response], { type: "text/plain" });
                element.href = URL.createObjectURL(file);
                element.download = "smart_contract.move";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
            >
              Download .move File
            </button>
            <button
              onClick={handleDeployClick}
              className="bg-tertiary text-tertiary-foreground px-4 py-2 rounded-md hover:bg-tertiary/90"
            >
              Deploy on Aptos 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
