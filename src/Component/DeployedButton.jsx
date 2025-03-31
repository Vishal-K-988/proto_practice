import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeployedButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the deploy form page.
    navigate('/deploy');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      Deploy on Aptos
    </button>
  );
}
