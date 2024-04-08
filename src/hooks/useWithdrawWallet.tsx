import {useCallback, useEffect, useMemo, useState} from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {MetaKeep} from "metakeep";
import {useQuery} from "./useQuery.tsx";

export function useWithdrawWallet() {
  const query = useQuery();

  const metakeep = useMemo(() => {
    return new MetaKeep({
      /* App id to configure UI */
      appId: "31bfa094-50c6-4036-bc32-8480c57b2edc",
      /* Signed in user's email address */
      user: {
        email: query.get('email'),
      }
    })
  }, [query]);

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const connected = useMemo(() => !!publicKey, [publicKey]);

  useEffect(() => {
    metakeep.getWallet().then(res => setPublicKey(new PublicKey(res.wallet.solAddress)));
  }, [metakeep]);

  const connection = useMemo(() => {
    return new Connection(import.meta.env.VITE_RPC_URL!, "confirmed");
  }, []);

  const signTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction) => {
      const metakeepRes: {signature: string} = await metakeep.signTransaction(transaction, 'Withdraw USD');
      const signature = Buffer.from(metakeepRes.signature.replace('0x', ''), 'hex');
      if (transaction instanceof Transaction) {
        transaction.signatures.push({
          publicKey: publicKey!,
          signature,
        });
        transaction.signatures = transaction.signatures.filter(sig => !!sig.signature);
      } else {
        transaction.signatures.push(signature);
      }

      return transaction;
    },
    [metakeep, publicKey],
  );

  const sendTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction) => {
      const signedTx = await signTransaction(transaction);
      return await connection.sendRawTransaction(signedTx.serialize());
    },
    [connection, signTransaction],
  );

  const signMessage = useCallback(
    async (message: string) => {
      return await metakeep.signMessage(message, 'Sign in');
    },
    [metakeep],
  );

  return {
    wallet: null,
    connected,
    publicKey,
    sendTransaction,
    signMessage,
    connection,
    signTransaction,
  };
}
