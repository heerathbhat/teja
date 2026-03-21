import { nextCoreWebVitalsConfig } from "eslint-config-next";

const eslintConfig = [
  ...nextCoreWebVitalsConfig,
  {
    ignores: [".next/**", "out/**", "build/**"],
  },
];

export default eslintConfig;
