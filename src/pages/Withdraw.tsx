import { useWithdrawWallet } from "../hooks/useWithdrawWallet.tsx";
import { useCallback } from "react";
import { useHeightHandler } from "../hooks/useHeightHandler.tsx";
import { CoinflowWithdraw, SolanaWallet } from "@coinflowlabs/react";
import {
  APP_THEME,
  BLOCKCHAIN,
  COINFLOW_ENV,
  MERCHANT_ID,
} from "../contants.ts";
import { useQuery } from "../hooks/useQuery.tsx";

export function Withdraw() {
  const query = useQuery();
  const wallet = useWithdrawWallet();
  const { height, handleHeightChange } = useHeightHandler();

  const onSuccess = useCallback(() => {
    // Optional
  }, []);

  if (!wallet || !wallet.publicKey)
    return <LoginForm connect={wallet.connect} />;

  return (
    <div style={{ height }} className={"w-full relative"}>
      {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-expect-error*/}
      <CoinflowWithdraw
        theme={APP_THEME}
        wallet={wallet as SolanaWallet}
        merchantId={MERCHANT_ID}
        env={COINFLOW_ENV}
        onSuccess={onSuccess}
        blockchain={BLOCKCHAIN}
        email={query.get("email") ?? ""}
        loaderBackground={APP_THEME.background}
        handleHeightChange={handleHeightChange}
      />
    </div>
  );
}

function LoginForm({ connect }: { connect: () => void }) {
  return (
    <div
      className={
        "bg-black p-10 flex flex-1 relative items-center justify-center"
      }
    >
      <button
        className={
          "bg-[#FFDA00] outline-none rounded-2xl p-5 px-7 hover:opacity-80 transition cursor-pointer"
        }
        onClick={connect}
      >
        <span className={"text-base font-semibold text-black"}>
          Login to withdraw
        </span>
      </button>
    </div>
  );
}
