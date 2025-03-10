module.exports = {
  // Add these or check if they're already set correctly
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^react-router-dom$": "react-router-dom",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};