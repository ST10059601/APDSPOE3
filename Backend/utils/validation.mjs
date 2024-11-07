// Whitelist allowing letters, numbers, underscores, dots, hyphens, and spaces
const whitelistPattern = /^[a-zA-Z0-9_.\- ]*$/;

export function checkWhitelist(input) {
  return whitelistPattern.test(input);
}
