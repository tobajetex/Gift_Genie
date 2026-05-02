export function checkEnvironment() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(`Missing API key in .env file`);
  }
}
