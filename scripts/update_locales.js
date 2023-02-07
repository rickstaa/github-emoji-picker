/**
 * @file Compare 'assets/supported_locales.json' with the languages in 'public/locales'
 * and create a pull request if there are new languages.
 */

const fs = require("fs/promises");

const run = async () => {
  console.log("Get current locales...");
  const currentLocales = await fs.readdir("public/locales");
  console.log(currentLocales);

  console.log(
    "Get supported locales from 'src/assets/supported_locales.json'..."
  );
  let supportedLocales = JSON.parse(
    await fs.readFile("src/assets/supported_locales.json", "utf-8")
  ).supportedLocales;
  console.log(supportedLocales);

  console.log("Compare current locales with set of supported locales...");
  const newLocales = currentLocales.filter(
    (locale) => !supportedLocales.includes(locale)
  );
  if (newLocales.length === 0) {
    console.log("No new locales found.");
    return;
  }
  console.log("New locales found:", newLocales);

  console.log("Update 'assets/supported_locales.json'...");
  const newSupportedLocales = {
    supportedLocales: [...supportedLocales, ...newLocales],
  };
  await fs.writeFile(
    "src/assets/supported_locales.json",
    JSON.stringify(newSupportedLocales, null, 2)
  );
  console.log("'src/assets/supported_locales.json' updated.");
};

run();
