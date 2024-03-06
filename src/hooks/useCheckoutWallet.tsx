import { SolanaWallet } from "@coinflowlabs/react";
import { useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

export function useCheckoutWallet(address: string | null) {
  const connection = useMemo(() => {
    return new Connection(import.meta.env.VITE_RPC_URL, "confirmed");
  }, []);

  const wallet: SolanaWallet | null = useMemo(() => {
    if (!address) return null;

    return {
      publicKey: new PublicKey(address),
      sendTransaction: () => {},
      connected: true,
    };
  }, [address]);

  return { wallet, connection };
}
