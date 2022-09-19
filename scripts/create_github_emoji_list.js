/**
 * @file Fetch the latest emoji data from the GitHub API, compare it with the emojis in
 * the 'emoji-datasource' package and generate the `github_emojis.json` and
 * `github_custom_emojis.json` data files.
 */
const { mkdir, writeFile } = require("fs");
const inflection = require("inflection");
const emojiLib = require("emojilib");
const emojiData = require("emoji-datasource");
const unicodeEmoji = require("unicode-emoji-json");
const { Octokit } = require("@octokit/core");

// Script variables
const DRY_RUN = process.argv.indexOf("--dry") !== -1;
const SKINS = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"];
const CATEGORIES = [
  ["Smileys & Emotion", "smileys"],
  ["People & Body", "people"],
  ["Animals & Nature", "nature"],
  ["Food & Drink", "foods"],
  ["Activities", "activity"],
  ["Travel & Places", "places"],
  ["Objects", "objects"],
  ["Symbols", "symbols"],
  ["Flags", "flags"],
];
const KEYWORD_SUBSTITUTES = {
  highfive: "highfive high-five",
};

/**
 * Translate unified format to native unicode format.
 * @param {*} unified The unified format.
 * @returns The native unicode format.
 */
function unifiedToNative(unified) {
  let unicodes = unified.split("-");
  let codePoints = unicodes.map((u) => `0x${u}`);
  return String.fromCodePoint(...codePoints);
}

/**
 * Build the emoji data files.
 * @param {*} githubEmojisData Object containing the GitHub emoji data.
 */
const buildData = (githubEmojisData) => {
  const categoriesIndex = {};
  const data = {
    categories: [],
    emojis: {},
    aliases: {},
    sheet: { cols: 61, rows: 61 },
  };
  const gitHubEmojis = {};
  const emojiDataUnified = {};

  // Add categories.
  CATEGORIES.forEach((category, i) => {
    let [name, id] = category;
    data.categories[i] = { id: id, emojis: [] };
    categoriesIndex[name] = i;
  });

  // Sort available emojis.
  emojiData.sort((a, b) => {
    let aTest = a.sort_order || a.short_name;
    let bTest = b.sort_order || b.short_name;

    return aTest - bTest;
  });

  // Retrieve emoji unicodes and unique GitHub emojis.
  for (const [key, value] of Object.entries(githubEmojisData.data)) {
    const match = value.match(/(?<=unicode\/).*(?=\.png)/);
    if (match) {
      emojiDataUnified[match[0].toUpperCase()] = key;
    } else {
      gitHubEmojis[key] = value;
    }
  }

  // Retrieve GitHub emojis that exist in the 'emoji-datasource' package.
  emojiData.forEach((datum) => {
    if (!githubEmojisData.data.hasOwnProperty(datum.short_name)) {
      // Filter out emojis that don't exist in the GitHub API.
      if (!emojiDataUnified.hasOwnProperty(datum.unified)) {
        return;
      }

      datum.short_name = emojiDataUnified[datum.unified];
    }

    // Throw warning if emoji doesn't have a category.
    if (!datum.category) {
      throw new Error(`“${datum.short_name}” doesn’t have a category`);
    }

    // Retrieve emoji information.
    let unified = datum.unified.toLowerCase();
    let native = unifiedToNative(unified);
    let name = inflection.titleize(
      datum.name || datum.short_name.replace(/-/g, " ") || ""
    );
    let unicodeEmojiName = inflection.titleize(unicodeEmoji[native].name || "");
    if (
      name.indexOf(":") === -1 &&
      unicodeEmojiName.length &&
      unicodeEmojiName.length < name.length
    ) {
      name = unicodeEmojiName;
    }

    // Throw warning if emoji name could not be retrieved.
    if (!name) {
      throw new Error(`“${datum.short_name}” doesn’t have a name`);
    }

    // Ensure short_name is first id element.
    let ids = datum.short_names || [];
    if (ids.indexOf(datum.short_name) === -1) {
      ids.unshift(datum.short_name);
    }

    // Add other ids as aliases.
    for (let id of ids) {
      if (id === ids[0]) continue;
      data.aliases[id] = ids[0];
    }
    let id = ids[0];

    // Make sure emoji text is first emoticons element.
    let emoticons = datum.texts || [];
    if (datum.text && emoticons.indexOf(datum.text) === -1) {
      emoticons.unshift(datum.text);
    }

    // Make sure expressionless emoticon has a emoji text.
    if (id === "expressionless") {
      if (emoticons.indexOf("-_-") === -1) {
        emoticons.push("-_-");
      }
    }

    // Make emojis searchable.
    let keywords = ids
      .concat(emojiLib[native] || [])
      .map((word) => {
        word = KEYWORD_SUBSTITUTES[word] || word;
        return word
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/(\w)-/, "$1_")
          .split(/[_|\s]+/);
      })
      .flat()
      .filter((word, i, words) => {
        return (
          words.indexOf(word) === i &&
          name.toLowerCase().split(/\s/).indexOf(word) === -1
        );
      });

    // Handle skin tone variations.
    let s = { unified, native };
    let skins = [s];
    if (datum.skin_variations) {
      for (let skin of SKINS) {
        let skinDatum =
          datum.skin_variations[skin] ||
          datum.skin_variations[`${skin}-${skin}`];

        if (!skinDatum) {
          skins.push(null);
          continue;
        }

        let unified = skinDatum.unified.toLowerCase();
        let native = unifiedToNative(skinDatum.unified);
        let s = { unified, native };

        skins.push(s);
      }
    }

    // Add version information to emoji.
    let addedIn = parseFloat(datum.added_in);
    if (addedIn < 1) addedIn = 1;
    const emoji = {
      id,
      name,
      emoticons,
      keywords,
      skins,
      version: addedIn,
    };

    // Remove emoticons property if empty.
    if (!emoji.emoticons.length) {
      delete emoji.emoticons;
    }

    // Handle Component category emoji variants.
    if (datum.category !== "Component") {
      let categoryIndex = categoriesIndex[datum.category];
      data.categories[categoryIndex].emojis.push(emoji.id);
      data.emojis[emoji.id] = emoji;
    }
  });

  // Reorder flags category.
  let flags = data.categories[categoriesIndex["Flags"]];
  flags.emojis = flags.emojis.sort();

  // Merge “Smileys & Emotion” and “People & Body” into a single category
  let smileys = data.categories[0];
  let people = data.categories[1];
  let smileysAndPeople = { id: "people" };
  smileysAndPeople.emojis = []
    .concat(smileys.emojis.slice(0, 114))
    .concat(people.emojis)
    .concat(smileys.emojis.slice(114));
  data.categories.unshift(smileysAndPeople);
  data.categories.splice(1, 2);

  // Retrieve unique GitHub emojis.
  let githubEmojis = { id: "github", name: "GitHub", emojis: [] };
  for (const [key, value] of Object.entries(gitHubEmojis)) {
    const emoji = {
      id: key,
      name: key[0].toUpperCase() + key.slice(1),
      keywords: [key],
      skins: [{ src: value }],
    };
    githubEmojis.emojis.push(emoji);
  }

  // Create emoji data files.
  if (!DRY_RUN) {
    let folder = "src/data";
    mkdir(folder, { recursive: true }, () => {
      writeFile(`${folder}/github_emojis.json`, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      writeFile(
        `${folder}/github_custom_emojis.json`,
        JSON.stringify(githubEmojis),
        (err) => {
          if (err) throw err;
        }
      );
    });
  }
};

/** Main code. */
const run = async () => {
  // Get the latest version of the emoji data.
  console.log("Fetching GitHub emoji data...");
  let githubEmojis;
  try {
    const octokit = new Octokit({});
    githubEmojis = await octokit.request("GET /emojis", {});
  } catch (error) {
    console.error("Could not retrieve GitHub emoji data.");
    throw error;
  }
  console.log("GitHub emoji data fetched.");

  // Compare with
  console.log("Create emoji data files...");
  buildData(githubEmojis);
  console.log("Emoji data files created.");
};

run();
