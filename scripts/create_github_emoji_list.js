/**
 * @file Fetch the latest emoji data from the GitHub API, compare it with the emojis in
 * the 'emoji-datasource' package and generate the `github_emojis.json` and
 * `github_custom_emojis.json` data files.
 */
const { mkdir, writeFile } = require("fs");
const inflection = require("inflection"); // Keyword support library.
const emojiLib = require("emojilib"); // Emoji data search library.
const emojiData = require("emoji-datasource"); // Multi-OS emoji data.
const unicodeEmoji = require("unicode-emoji-json"); // Unicode emoji data.
const { Octokit } = require("@octokit/core");
const CustomKeyWords = require("./keywords.json");

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
}; // Extend the keyword list with custom keywords.

/**
 * Move array item to the front of the array.
 * @param {array} arr Input array.
 * @param {string} queryStr The item to move to the front of the array.
 * @returns {array} The array with the item moved to the front.
 */
const moveToFront = (arr, queryStr) =>
  arr.reduce((acc, curr) => {
    if (queryStr === curr) {
      return [curr, ...acc];
    }
    return [...acc, curr];
  }, []);

/**
 * Parse the unicode coming from the 'emoji-datasource' package to remove unicode
 * padding characters.
 * @param {string} unicode The unicode string.
 * @returns {string} The unicode string without padding characters.
 */
const parseEmojiDataUnicode = (emojiDataUnicode) => {
  return emojiDataUnicode
    .toLowerCase()
    .replaceAll("-200d", "")
    .replaceAll("-fe0f", "");
};

/**
 * Translate unified format to native unicode format.
 * @param {string} unified The unified format.
 * @returns {string} The native unicode format.
 */
const unifiedToNative = (unified) => {
  let unicodes = unified.split("-");
  let codePoints = unicodes.map((u) => `0x${u}`);
  return String.fromCodePoint(...codePoints);
};

/**
 * Parse unicode and custom emojis from GitHub emoji API response.
 * @param {Object} githubEmojisData Object containing the GitHub emoji data retrieved from
 * the GitHub emoji API.
 * @returns {Object} Object containing the parsed GitHub emojis.
 * @throws {Error} Throws an error if not all GitHub emojis were parsed.
 */
const parseGitHubEmojiData = (githubEmojisData) => {
  let unicodeEmojis = {};
  let customEmojis = {};

  // Loop through GitHub emoji data and get the unicode. Store as custom emoji if no
  // unicode is found.
  for (const [key, value] of Object.entries(githubEmojisData)) {
    let match = value.match(/(?<=unicode\/).*(?=\.png)/);
    if (match) {
      match = match[0].toLowerCase();
      unicodeEmojis[match] = unicodeEmojis[match] || [];
      unicodeEmojis[match].push(key);
      continue;
    }

    // If no unicode is found, store as custom emoji.
    if (Object.keys(customEmojis).includes(key))
      throw new Error("Duplicate custom GitHub emoji's found.");
    customEmojis[key] = value;
  }

  // Throw error if not all GitHub emojis were parsed.
  if (
    Object.keys(customEmojis).length +
      Object.values(unicodeEmojis).flat().length !==
    Object.keys(githubEmojisData).length
  ) {
    throw new Error("Not all emoji unicodes were successfully parsed.");
  }
  return { unicodeEmojis, customEmojis };
};

/**
 * Add GitHub short names to the 'emoji-datasource' object.
 * @param {Object} emojiObject The 'emoji-datasource' object.
 * @param {array} githubShortNames The GitHub short names.
 * @returns {Object} The 'emoji-datasource' object with the GitHub short names added.
 */
const addGitHubShortName = (emojiObject, githubShortNames) => {
  emojiObject.short_names = emojiObject.short_names || [];
  emojiObject.short_names = [
    ...new Set([...emojiObject.short_names, ...githubShortNames]),
  ];
  emojiObject.github_short_name = githubShortNames[0];
  return emojiObject;
};

/**
 * Filter the 'emoji-datasource' package data to only include the GitHub emojis.
 * @param {Object} githubUnicodeEmojis Object containing the GitHub emoji unicodes.
 * @returns {array} Array containing the filtered 'emoji-datasource' package data.
 * @throws {Error} Throws an error if not all GitHub emojis have a match.
 */
const getFilteredEmojiData = (githubUnicodeEmojis) => {
  let filteredEmojis = [];
  let notFound = [];

  // Loop through GitHub unicodes and try to find a match in the 'emoji-datasource'.
  for (const [key, value] of Object.entries(githubUnicodeEmojis)) {
    // Try to find match by using unicode.
    const unicodeObject = emojiData.find(
      (item) => item.unified.toLowerCase() === key
    );
    if (unicodeObject) {
      filteredEmojis.push(addGitHubShortName(unicodeObject, value));
      continue;
    }

    // Try to find match by using non-qualified unicode.
    const nonQualifiedObject = emojiData.find(
      (item) =>
        (item.non_qualified ? item.non_qualified.toLowerCase() : null) === key
    );
    if (nonQualifiedObject) {
      filteredEmojis.push(addGitHubShortName(nonQualifiedObject, value));
      continue;
    }

    // Try to find match by using parsed unicode.
    const unicodeObjectParsed = emojiData.find(
      (item) => parseEmojiDataUnicode(item.unified.toLowerCase()) === key
    );
    if (unicodeObjectParsed) {
      filteredEmojis.push(addGitHubShortName(unicodeObjectParsed, value));
      continue;
    }

    notFound.push(value);
  }

  // Throw error if not all GitHub Emojis have a match.
  if (notFound.length) {
    throw new Error(
      `Some GitHub Emojis could not be found in the 'emoji-datasource' package: ${notFound
        .flat()
        .join(", ")}.`
    );
  }

  return filteredEmojis;
};

/**
 * Build the emoji data files.
 * @param {Object} githubEmojisData Object containing the GitHub emoji data retrieved from
 * the GitHub emoji API.
 */
const buildData = (githubEmojisData) => {
  let categoriesIndex = {};
  let data = {
    categories: [],
    emojis: {},
    aliases: {},
    sheet: { cols: 61, rows: 61 },
  };

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

  // Parse GitHub emojis unicode and subtract custom GitHub emojis.
  const {
    unicodeEmojis: githubUnicodeEmojis,
    customEmojis: githubCustomEmojis,
  } = parseGitHubEmojiData(githubEmojisData);

  // Retrieve filtered emoji data from 'emoji-datasource'.
  const filteredEmojis = getFilteredEmojiData(githubUnicodeEmojis);

  // Make GitHub emojis searchable and create the EmojiMart data source.
  filteredEmojis.forEach((datum) => {
    if (!datum.category)
      throw new Error(`“${datum.short_name}” doesn’t have a category.`);

    // Retrieve emoji information.
    let unified = datum.unified.toLowerCase();
    let native = unifiedToNative(unified);
    let name = inflection.titleize(
      datum.name || datum.short_name.replace(/-/g, " ") || ""
    );
    let unicodeEmojiName = inflection.titleize(
      unicodeEmoji[native]?.name || ""
    );
    if (
      name.indexOf(":") === -1 &&
      unicodeEmojiName.length &&
      unicodeEmojiName.length < name.length
    ) {
      name = unicodeEmojiName;
    }
    if (!name) throw new Error(`“${datum.short_name}” doesn’t have a name.`);

    // Ensure short_name is first id.
    let ids = datum.short_names || [];
    if (ids.indexOf(datum.short_name) === -1) {
      ids.unshift(datum.short_name);
    } else if (ids[0] !== datum.short_name) {
      ids = moveToFront(ids, datum.short_name);
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
    } else if (emoticons[0] !== datum.text) {
      emoticons = moveToFront(emoticons, datum.text);
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

    // Create emoji object.
    const emoji = {
      id: datum.github_short_name,
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

    // Don't add Component emoji category items these are already included as skins.
    if (datum.category !== "Component") {
      let categoryIndex = categoriesIndex[datum.category];
      data.categories[categoryIndex].emojis.push(emoji.id);
      data.emojis[emoji.id] = emoji;
    }
  });

  // Sort flags category.
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

  // Create EmojiMart data object for the unique GitHub emojis.
  let githubEmojis = { id: "github", name: "GitHub", emojis: [] };
  for (const [key, value] of Object.entries(githubCustomEmojis)) {
    if (CustomKeyWords[key] === undefined)
      throw new Error(`“${key}” doesn’t have a keyword.`);
    const emoji = {
      id: key,
      name: inflection.capitalize(key),
      keywords: CustomKeyWords[key].keywords,
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
  // Retrieve GITHUB_TOKEN from environment variables.
  if (!process.env.GITHUB_TOKEN) {
    console.error("No GitHub token found.");
    return;
  }

  // Get the latest version of the emoji data.
  console.log("Fetching GitHub emoji data...");
  let githubEmojis;
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });  
    githubEmojis = await octokit.request("GET /emojis", {});
  } catch (error) {
    console.error("Could not retrieve GitHub emoji data.");
    throw error;
  }
  console.log("GitHub emoji data fetched.");

  // Compare with
  console.log("Create emoji data files...");
  buildData(githubEmojis.data);
  console.log("Emoji data files created.");
};

run();
