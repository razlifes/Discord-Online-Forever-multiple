const Eris = require("eris");
const keep_alive = require('./keep_alive.js');

// Debug: print all env var KEYS so you can confirm Railway is passing them in
console.log("Env keys available:", Object.keys(process.env).join(", "));

// Supports up to 10 tokens via environment variables:
// token, token1, token2, ... token10
const TOKEN_KEYS = [
  'token',
  'token1', 'token2', 'token3', 'token4', 'token5',
  'token6', 'token7', 'token8', 'token9', 'token10'
];

// Collect all tokens that are actually set in the environment
const tokens = TOKEN_KEYS
  .map(key => {
    const val = process.env[key];
    console.log(`Checking "${key}": ${val ? "FOUND" : "not set"}`);
    return val;
  })
  .filter(Boolean)
  .filter((value, index, self) => self.indexOf(value) === index); // deduplicate

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
