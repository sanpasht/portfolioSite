import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships flat configs directly, so no FlatCompat wrapper.
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    // `next-env.d.ts` is generated and git-ignored; linting it is noise.
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
