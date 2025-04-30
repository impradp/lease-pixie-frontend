"use client";

import React, { useEffect, useRef } from "react";
import { usePlaidLink } from "react-plaid-link";

/**
 * Props for the PlaidLinkInitializer component.
 */
interface PlaidLinkInitializerProps {
  /** Token generated from your server to initialize Plaid Link */
  linkToken: string;
  /** Callback function executed when user successfully links their account */
  onSuccess: (publicToken: string) => void;
  /** Callback function executed when user exits the Plaid Link flow */
  onExit: () => void;
  /** Flag to show a loading overlay in sandbox mode */
  showSandbox: boolean;
}

/**
 * Component that initializes and manages the Plaid Link integration.
 * Automatically opens the Plaid modal when ready and handles callbacks.
 */
const PlaidLinkInitializer = ({
  linkToken,
  onSuccess,
  onExit,
  showSandbox,
}: PlaidLinkInitializerProps) => {
  // Track component mounting state to prevent callbacks after unmount
  const isMounted = useRef(true);

  // Set up and clean up the mounted state tracker
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize the Plaid Link hook with callbacks
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      if (isMounted.current) {
        onSuccess(publicToken);
      }
    },
    onExit: () => {
      if (isMounted.current) {
        onExit();
      }
    },
  });

  // Automatically open Plaid Link when ready
  useEffect(() => {
    if (linkToken && ready && isMounted.current) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <>
      {showSandbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgb(169, 170, 177)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <br />
            <p className="text-white text-lg">Preparing Plaid Link...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaidLinkInitializer;
