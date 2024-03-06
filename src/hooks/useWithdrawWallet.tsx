import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import RPC from "../SolanaRpc.ts";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

export function useWithdrawWallet() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null,
  );

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const connected = useMemo(() => !!publicKey, [publicKey]);

  const connection = useMemo(() => {
    const rpcUrl = web3auth?.options.chainConfig?.rpcTarget;
    if (!rpcUrl) return null;
    return new Connection(rpcUrl, "confirmed");
  }, [web3auth?.options.chainConfig?.rpcTarget]);

  const sendTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction) => {
      console.log(
        Buffer.from(
          transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          }),
        ).toString("base64"),
      );
      if (!provider) {
        throw new Error("provider not initialized yet");
      }
      const rpc = new RPC(provider);
      const signedTx = await rpc.signTransaction(transaction as Transaction);
      if (!connection) throw new Error("error");
      return await connection.sendRawTransaction(signedTx.serialize());
    },
    [connection, provider],
  );

  const signTransaction = useCallback(
    async (transaction: Transaction) => {
      if (!provider) {
        throw new Error("provider not initialized yet");
      }
      const rpc = new RPC(provider);
      return await rpc.signTransaction(transaction);
    },
    [provider],
  );

  const signMessage = useCallback(
    async (message: string) => {
      if (!provider) {
        throw new Error("provider not initialized yet");
      }
      const rpc = new RPC(provider);
      return await rpc.signMessage(message);
    },
    [provider],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          // rpcTarget: process.env.REACT_APP_API_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          rpcTarget: import.meta.env.VITE_RPC_URL,
        };

        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig: chainConfig },
        });

        const web3auth = new Web3Auth({
          clientId:
            "BPiYjwnlxjhSB4i0HzhjW3pKGp9trJvK1AaBXmoDNTXFUT8fjMVIe5zk9KN6kNqs6v2KyKY2JF0TEtaxxSPwu1s",
          web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
          privateKeyProvider,
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const connect = async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized yet");
    }
    const web3authProvider = await web3auth.connect();

    setProvider(web3authProvider);
    getAccounts().then((accounts) => {
      if (!Array.isArray(accounts)) return;
      setPublicKey(new PublicKey(accounts[0]));
    });
  };

  const getAccounts = useCallback(async () => {
    if (!provider) {
      throw new Error("provider not initialized yet");
    }
    const rpc = new RPC(provider);
    return await rpc.getAccounts();
  }, [provider]);

  useEffect(() => {
    if (!provider) {
      setPublicKey(null);
      return;
    }

    if (publicKey) return;

    getAccounts().then((accounts) => {
      if (!Array.isArray(accounts)) return;
      setPublicKey(new PublicKey(accounts[0]));
    });
  }, [getAccounts, provider, publicKey]);

  const disconnect = async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized yet");
    }
    await web3auth.logout();
    setProvider(null);
  };

  return {
    wallet: null,
    connected,
    publicKey,
    sendTransaction,
    signMessage,
    connect,
    disconnect,
    connection,
    signTransaction,
  };
}
