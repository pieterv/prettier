import fs from "node:fs";

/**
 * @param {string} filename
 * @returns {Promise<undefined | string>}
 */
function readFile(filename) {
  try {
    return fs.readFileSync(filename, "utf8");
  } catch (/** @type {any} */ error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw new Error(`Unable to read '${filename}': ${error.message}`);
  }
}

export default readFile;
