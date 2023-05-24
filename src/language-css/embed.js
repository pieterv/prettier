import { hardline } from "../document/builders.js";
import printFrontMatter from "../utils/front-matter/print.js";

function embed(path) {
  const { node } = path;

  if (node.type === "front-matter") {
    return (textToDoc) => {
      const doc = printFrontMatter(node, textToDoc);
      return doc ? [doc, hardline] : undefined;
    };
  }
}

// `front-matter` only available on `css-root`
embed.getVisitorKeys = (node) =>
  node.type === "css-root" ? ["frontMatter"] : [];

export default embed;
