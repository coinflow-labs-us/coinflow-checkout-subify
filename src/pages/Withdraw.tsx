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
