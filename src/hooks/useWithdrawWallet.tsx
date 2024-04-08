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
    metakeep.getWallet().then(res => setPublicKey(res.wallet.solAddress));
  }, [metakeep]);

  const connection = useMemo(() => {
    return new Connection(import.meta.env.VITE_RPC_URL!, "confirmed");
  }, []);

  const signTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction) => {
      console.dir(transaction, {depth: null, maxArrayLength: null});
      const metakeepRes: {signedRawTransaction: string} = await metakeep.signTransaction(transaction, 'Withdraw USD');
      return VersionedTransaction.deserialize(Buffer.from(metakeepRes.signedRawTransaction.replace('0x', ''), 'base64'));
    },
    [metakeep],
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
