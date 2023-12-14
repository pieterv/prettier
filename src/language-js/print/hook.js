import {
  group,
} from "../../document/builders.js";
import { printDeclareToken } from "./misc.js";
import { printFunctionParameters, shouldGroupFunctionParameters } from "./function-parameters.js";
import { printReturnType } from "./function.js";
import { printFunctionTypeParameters } from "./misc.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

/*
- "HookDeclaration"
- "DeclareHook"
- "HookTypeAnnotation"
*/
function printHook(path, options, print) {
  const { node } = path;

  const parts = [printDeclareToken(path), "hook"];
  if (node.id) {
    parts.push(" ", print("id"));
  }

  const parametersDoc = printFunctionParameters(path, print, options, false, true);
  const returnTypeDoc = printReturnType(path, print);
  const shouldGroupParameters = shouldGroupFunctionParameters(
    node,
    returnTypeDoc,
  );

  parts.push(
    group([
      shouldGroupParameters ? group(parametersDoc) : parametersDoc,
      returnTypeDoc,
    ]),
    node.body ? " " : "",
    print("body"),
  );

  if (options.semi && (node.declare || !node.body)) {
    parts.push(";");
  }

  return parts;
}

export { printHook };
