import {
  group,
} from "../../document/builders.js";
import { printDeclareToken } from "./misc.js";
import { printFunctionParameters, shouldGroupFunctionParameters } from "./function-parameters.js";
import { printReturnType } from "./function.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

/*
- "HookDeclaration"
- "DeclareHook"
*/
function printHook(path, options, print) {
  const { node } = path;

  console.log(node);

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

/*
- "HookTypeAnnotation"
*/
function printHookTypeAnnotation(path, options, print) {
  const { node } = path;
  const parts = [];

  return [];

  let parametersDoc = printFunctionParameters(
    path,
    print,
    options,
    /* expandArg */ false,
    /* printTypeParams */ true,
  );

  const returnTypeDoc = [];
  returnTypeDoc.push(": ", print("returnType"));

  if (shouldGroupFunctionParameters(node, returnTypeDoc)) {
    parametersDoc = group(parametersDoc);
  }

  parts.push(parametersDoc, returnTypeDoc);

  return group(parts);
}

export { printHook, printHookTypeAnnotation };
