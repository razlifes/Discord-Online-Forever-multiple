const Eris = require("eris");
const keep_alive = require('./keep_alive.js');

// Supports up to 10 tokens via environment variables:
// token1, token2, token3, ... token10
// You can also still use just "token" for a single token (backwards compatible).

const TOKEN_KEYS = [
  'token',   // backwards-compatible single token
  'token1', 'token2', 'token3', 'token4', 'token5',
  'token6', 'token7', 'token8', 'token9', 'token10'
];

// Collect all tokens that are actually set in the environment
const tokens = TOKEN_KEYS
  .map(key => process.env[key])
  .filter(Boolean)
  // Deduplicate in case someone sets both "token" and "token1" to the same value
  .filter((value, index, self) => self.indexOf(value) === index);

if (tokens.length === 0) {
  console.error(
    "No tokens found. Set at least one of these environment variables:\n" +
    "  token, token1, token2, ... token10"
  );
  process.exit(1);
}

console.log(`Starting ${tokens.length} bot instance(s)...`);

tokens.forEach((token, index) => {
  const label = `Bot #${index + 1}`;

  const bot = new Eris(token);

  bot.on("ready", () => {
    console.log(`[${label}] Connected as ${bot.user.username}#${bot.user.discriminator}`);
  });

  bot.on("error", (err) => {
    console.error(`[${label}] Error:`, err);
  });

  bot.on("disconnect", () => {
    console.warn(`[${label}] Disconnected. Reconnecting...`);
  });

  bot.connect();
});
