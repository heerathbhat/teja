import pkg from "eslint-config-next";
const { nextCoreWebVitalsConfig } = pkg;

const eslintConfig = [
  ...nextCoreWebVitalsConfig,
  {
    ignores: [".next/**", "out/**", "build/**"],
  },
];

export default eslintConfig;
