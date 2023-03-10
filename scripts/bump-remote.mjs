import crypto from "crypto";
import fetch from "node-fetch";

const getRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
};

const getEnv = (key) => {
  const variable = process.env[key];

  if (!variable) {
    throw new Error(`Env var ${key} is not set.`);
  }

  return variable;
};

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    getEnv("GH_BOT_ENCRYPTION_SECRET"),
    iv
  );
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    content: crypted,
  };
}

async function main() {
  try {
    const version = process.argv[2];
    const accessToken = getEnv("GH_BOT_AUTH_TOKEN");
    const apiUrl = getEnv("GH_BOT_API_URL");

    if (!version) {
      throw new Error("Version argument must be specified");
    }

    const data = encrypt(
      JSON.stringify({
        authToken: accessToken,
        repositoryOwner: "ncpa0",
        repositoryName: "jsxte",
        branchName: "master",
        irrelevantGibberish: getRandomString(
          Math.round(Math.random() * 28) + 4
        ),
      })
    );

    await fetch(`${apiUrl}/bump-version`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
