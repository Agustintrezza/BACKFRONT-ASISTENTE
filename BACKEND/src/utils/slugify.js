// utils/slugify.js
function slugify(input) {
    return (input || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // remove accents
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "") // remove emojis
      .replace(/[^a-z0-9\s-]/g, "") // keep letters, numbers, spaces and dashes
      .replace(/\s+/g, "-")
      .trim();
  }
  
  module.exports = { slugify };
  