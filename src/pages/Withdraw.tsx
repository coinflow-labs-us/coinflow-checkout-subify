import { useWithdrawWallet } from "../hooks/useWithdrawWallet.tsx";
import { useCallback } from "react";
import { useHeightHandler } from "../hooks/useHeightHandler.tsx";
import { CoinflowWithdraw, SolanaWallet } from "@coinflowlabs/react";
import { APP_THEME } from "../contants.ts";

export function Withdraw() {
  const wallet: SolanaWallet = useWithdrawWallet();
  const { height, handleHeightChange } = useHeightHandler();

  const onSuccess = useCallback(() => {
    // Optional
  }, []);

  if (!wallet || !wallet.publicKey) return <LoginForm />;

  return (
    <div style={{ height }} className={"w-full relative"}>
      {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-expect-error*/}
      <CoinflowWithdraw
        theme={APP_THEME}
        wallet={wallet as SolanaWallet}
        merchantId={"privy"}
        env={"sandbox"}
        onSuccess={onSuccess}
        blockchain={"polygon"}
        email={""}
        loaderBackground={APP_THEME.background}
        handleHeightChange={handleHeightChange}
      />
    </div>
  );
}

function LoginForm() {
  const { connect } = useWithdrawWallet();
  return (
    <div
      className={
        "bg-black lg:bg-white p-10 flex flex-1 relative items-center justify-center"
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
