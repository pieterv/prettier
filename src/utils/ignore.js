import path from "node:path";
import url from "node:url";
import createIgnore from "ignore";
import { isUrl, toPath } from "url-or-path";
import readFile from "../utils/read-file.js";

/** @type {(filePath: string) => string} */
const slash =
  path.sep === "\\"
    ? (filePath) => filePath.replaceAll("\\", "/")
    : (filePath) => filePath;

function getRelativePath(file, ignoreFile) {
  const ignoreFilePath = toPath(ignoreFile);
  const filePath = isUrl(file) ? url.fileURLToPath(file) : path.resolve(file);

  return path.relative(
    // If there's an ignore-path set, the filename must be relative to the
    // ignore path, not the current working directory.
    ignoreFilePath ? path.dirname(ignoreFilePath) : process.cwd(),
    filePath,
  );
}

/**
 * @param {string | URL | undefined} ignoreFile
 * @param {boolean} [withNodeModules]
 * @returns {(file: string | URL) => boolean}
 */
function createSingleIsIgnoredFunction(ignoreFile, withNodeModules) {
  let content = "";

  if (ignoreFile) {
    content += readFile(ignoreFile) ?? "";
  }

  if (!withNodeModules) {
    content += "\n" + "node_modules";
  }

  if (!content) {
    return;
  }

  const ignore = createIgnore({ allowRelativePaths: true }).add(content);

  return (file) =>
    ignore.checkIgnore(slash(getRelativePath(file, ignoreFile))).ignored;
}

/**
 * @param {(string | URL)[]} ignoreFiles
 * @param {boolean?} withNodeModules
 * @returns {(file: string | URL) => boolean}
 */
function createIsIgnoredFunction(ignoreFiles, withNodeModules) {
  // If `ignoreFilePaths` is empty, we still want `withNodeModules` to work
  if (ignoreFiles.length === 0 && !withNodeModules) {
    ignoreFiles = [undefined];
  }

  const isIgnoredFunctions = ignoreFiles
    .map((ignoreFile) =>
      createSingleIsIgnoredFunction(ignoreFile, withNodeModules),
    )
    .filter(Boolean);

  return (file) => isIgnoredFunctions.some((isIgnored) => isIgnored(file));
}

/**
 * @param {string | URL} file
 * @param {{ignorePath: string[], withNodeModules?: boolean}} options
 * @returns {boolean}
 */
function isIgnored(file, options) {
  const { ignorePath: ignoreFiles, withNodeModules } = options;
  const isIgnored = createIsIgnoredFunction(ignoreFiles, withNodeModules);
  return isIgnored(file);
}

export { createIsIgnoredFunction, isIgnored };
