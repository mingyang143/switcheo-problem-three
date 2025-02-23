# Switcheo problem three

## Issues with the code

1. Minor issue: The Wallet Balance interfaces should not be in the same file as the actual logic code. The interfaces should be placed in a directory called model.

2. ` useEffect(() => {
  const datasource = new Datasource(
    "https://interview.switcheo.com/prices.json"
  );
  datasource
    .getPrices()
    .then((prices) => {
      setPrices(prices);
    })
    .catch((error) => {
      console.err(error);
    });
}, []);`

console.err is not the correct function. It should be console.error(error)

3. `if (lhsPriority > -99) {
  if (balance.amount <= 0) {
    return true;
  }
}`
   I believe lhsPriority is a typo. It should be balancePriority.
   Wallet balance seems to be missing a blockchain (String) attribute in the interface

4. `const getPriority = (blockchain: any): number => {
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
};`
   Using any as a type is really not a good practise as it is not making use of typescript's type safety. We should change any to string type.

5. `const WalletPage: React.FC<Props> = (props: Props) => {`
   WalletPage component is not exported.

6. `interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({children, ...rest}) => {`

The interface Props does not have to property children so we cannot pass children props. I the property 'children'. I also removed BoxProps since it is not used anywhere else in the code

7. `const balances = useWalletBalances();`
   useWalletBalances is a hook that should be imported.

8. ` return (
  <WalletRow
    className={classes.row}
    key={index}
    amount={balance.amount}
    usdValue={usdValue}
    formattedAmount={balance.formatted}
  />
);`
   I removed the className prop as classes.row does not exist.
   I also added a import for WalletRow

9. Other minor syntax errors are fixed according to my interpretation of the code. eg. I changed `const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);` to `const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );` since rows requires each balance to be of FormattedWalletBalance type.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
