"use strict";

const americanOnly = require("./american-only.js");
const britishOnly = require("./british-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");

class Translator {
  constructor() {
    this.americanToBritish = {
      ...americanOnly,
      ...americanToBritishSpelling,
      ...americanToBritishTitles,
    };

    this.britishToAmerican = {
      ...britishOnly,
      ...this.reverseDictionary(americanToBritishSpelling),
      ...this.reverseDictionary(americanToBritishTitles),
    };
  }

  reverseDictionary(dictionary) {
    const reversed = {};

    Object.keys(dictionary).forEach((key) => {
      reversed[dictionary[key]] = key;
    });

    return reversed;
  }

  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  preserveCase(original, translated) {
    if (!original || !translated) {
      return translated;
    }

    if (original[0] === original[0].toUpperCase()) {
      return translated[0].toUpperCase() + translated.slice(1);
    }

    return translated;
  }

  highlight(text) {
    return `<span class="highlight">${text}</span>`;
  }

  replaceTerms(text, dictionary, shouldHighlight) {
    let translatedText = text;

    const terms = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    terms.forEach((term) => {
      const escapedTerm = this.escapeRegex(term);
      const regex = new RegExp(`(^|[^A-Za-z0-9])(${escapedTerm})(?=$|[^A-Za-z0-9])`, "gi");

      translatedText = translatedText.replace(regex, (match, prefix, foundTerm) => {
        let replacement = dictionary[term.toLowerCase()] || dictionary[term];

        replacement = this.preserveCase(foundTerm, replacement);

        if (shouldHighlight) {
          replacement = this.highlight(replacement);
        }

        return prefix + replacement;
      });
    });

    return translatedText;
  }

  replaceTime(text, locale, shouldHighlight) {
    if (locale === "american-to-british") {
      return text.replace(/\b([0-9]{1,2}):([0-9]{2})\b/g, (match, hour, minute) => {
        const replacement = `${hour}.${minute}`;
        return shouldHighlight ? this.highlight(replacement) : replacement;
      });
    }

    if (locale === "british-to-american") {
      return text.replace(/\b([0-9]{1,2})\.([0-9]{2})\b/g, (match, hour, minute) => {
        const replacement = `${hour}:${minute}`;
        return shouldHighlight ? this.highlight(replacement) : replacement;
      });
    }

    return text;
  }

  translate(text, locale, shouldHighlight = true) {
    let dictionary;

    if (locale === "american-to-british") {
      dictionary = this.americanToBritish;
    } else if (locale === "british-to-american") {
      dictionary = this.britishToAmerican;
    } else {
      return text;
    }

    let translatedText = this.replaceTerms(text, dictionary, shouldHighlight);
    translatedText = this.replaceTime(translatedText, locale, shouldHighlight);

    return translatedText;
  }
}

module.exports = Translator;