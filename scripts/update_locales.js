/**
 * @file Compare 'assets/supported-locals.json' with the languages in 'public/locales'
 * and create a pull request if there are new languages.
 */

import fs from "fs/promises";
import lcs from "src/assets/supported-locals.json"

const run = async () => {
  console.log("Get current locales...");
  const currentLocales = await fs.readdir("public/locales");
  console.log(currentLocales);

  console.log("Get supported locales from 'src/assets/supported_locals.json'...");
  const supportedLocales = lcs

  console.log("Compare current locales with set of supported locales...");
  const newLocales = currentLocales.filter((locale) => !supportedLocales.includes(locale));
  if (newLocales.length === 0) {
    console.log("No new locales found.");
    return;
  }
  console.log("New locales found:", newLocales);
  
  console.log("Update 'assets/supported-locals.json'...");
  const newSupportedLocales = [...supportedLocales, ...newLocales];
  await fs.writeFile("src/assets/supported-locals.json", JSON.stringify(newSupportedLocales, null, 2));
  console.log("'src/assets/supported_locals.json' updated.");
}

run();
