import { CoinflowPurchase } from "@coinflowlabs/react";
import { useCallback } from "react";
import { useHeightHandler } from "../hooks/useHeightHandler.tsx";
import { EmptyState } from "../App.tsx";
import { useQuery } from "../hooks/useQuery.tsx";
import { useCheckoutWallet } from "../hooks/useCheckoutWallet.tsx";
import {
  APP_THEME,
  BLOCKCHAIN,
  COINFLOW_ENV,
  MERCHANT_ID,
} from "../contants.ts";

export function BuyCredits() {
  const query = useQuery();
  const { height, handleHeightChange } = useHeightHandler();

  const onSuccess = useCallback(() => {
    // Optional
  }, []);

  const { wallet, connection } = useCheckoutWallet(query.get("wallet"));

  if (!wallet) return <EmptyState />;

  return (
    <div style={{ height }} className={"w-full relative"}>
      <CoinflowPurchase
        merchantId={MERCHANT_ID}
        wallet={wallet}
        blockchain={BLOCKCHAIN}
        connection={connection}
        env={COINFLOW_ENV}
        onSuccess={onSuccess}
        amount={Number(query.get("amount"))}
        handleHeightChange={handleHeightChange}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        theme={APP_THEME}
        email={query.get("email") ?? undefined}
        loaderBackground={APP_THEME.background}
      />
    </div>
  );
}
