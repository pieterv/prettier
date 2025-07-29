import fs from "node:fs";
import { isUrlString } from "url-or-path";

/**
 * @param {string | URL} file
 * @returns {undefined | string}
 */
function readFile(file) {
  if (isUrlString(file)) {
    file = new URL(file);
  }

  try {
    return fs.readFileSync(file, "utf8");
  } catch (/** @type {any} */ error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw new Error(`Unable to read '${file}': ${error.message}`);
  }
}

export default readFile;
