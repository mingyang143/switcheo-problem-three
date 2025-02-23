import { useEffect, useMemo, useState } from "react";
import useWalletBalances from "./Hooks/useWalletBalances.tsx";
import WalletRow from "./Components/WalletRow.tsx";

import {
  WalletBalance,
  FormattedWalletBalance,
  CurrencyPrice,
} from "./Models/WalletBalance.models";

class Datasource {
  // TODO: Implement datasource class
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    return fetch(this.url)
      .then((response) => response.json())
      .then((data: CurrencyPrice[]) => data)
      .then((data: CurrencyPrice[]) => {
        const prices: Record<string, number> = {};
        data.forEach((price: CurrencyPrice) => {
          prices[price.currency] = price.price;
        });
        return prices;
      });
  }
}

interface Props {
  children: React.ReactNode;
}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;
