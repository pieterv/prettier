import {
  group,
  hardline,
  ifBreak,
  indent,
  join,
  line,
  softline,
} from "../../document/builders.js";
import { printDanglingComments } from "../../main/comments/print.js";
import {
  CommentCheckFlags,
  hasComment,
  isNextLineEmpty,
} from "../utils/index.js";

/*
- "MatchExpression"
- "MatchStatement"
*/
export function printMatch(path, options, print) {
  const { node } = path;
  return [
    group(["match (", indent([softline, print("argument")]), softline, ")"]),
    " {",
    node.cases.length > 0
      ? indent([
          hardline,
          join(
            hardline,
            path.map(
              ({ node, isLast }) => [
                print(),
                !isLast && isNextLineEmpty(node, options) ? hardline : "",
              ],
              "cases",
            ),
          ),
        ])
      : "",
    hardline,
    "}",
  ];
}

/*
- "MatchExpressionCase"
- "MatchStatementCase"
*/
export function printMatchCase(path, options, print) {
  const { node } = path;

  const comment = hasComment(node, CommentCheckFlags.Dangling)
    ? [" ", printDanglingComments(path, options)]
    : [];

  const body =
    node.type === "MatchStatementCase"
      ? [" ", print("body")]
      : indent([line, print("body"), ","]);

  return [
    print("pattern"),
    node.guard ? [" if (", print("guard"), ")"] : "",
    group([" =>", comment, body]),
  ];
}

/*
- "MatchOrPattern"
- "MatchAsPattern"
- "MatchWildcardPattern"
- "MatchLiteralPattern"
- "MatchUnaryPattern"
- "MatchIdentifierPattern"
- "MatchMemberPattern"
- "MatchBindingPattern"
- "MatchObjectPattern"
- "MatchArrayPattern"
- "MatchObjectPatternProperty"
- "MatchRestPattern"
*/
export function printMatchPattern(path, option, print) {
  const { node, parent } = path;

  switch (node.type) {
    case "MatchOrPattern": {
      const parts = join([" |", line], path.map(print, "patterns"));
      if (parent.type === "MatchAsPattern") {
        return ["(", parts, ")"];
      }
      return group(parts);
    }
    case "MatchAsPattern":
      return [print("pattern"), " as ", print("target")];
    case "MatchWildcardPattern":
      return ["_"];
    case "MatchLiteralPattern":
      return print("literal");
    case "MatchUnaryPattern":
      return [node.operator, print("argument")];
    case "MatchIdentifierPattern":
      return print("id");
    case "MatchMemberPattern": {
      const property =
        node.property.type === "Identifier"
          ? [".", print("property")]
          : ["[", indent([softline, print("property")]), softline, "]"];
      return group([print("base"), property]);
    }
    case "MatchBindingPattern":
      return [node.kind, " ", print("id")];
    case "MatchObjectPattern": {
      const properties = path.map(print, "properties");
      if (node.rest) {
        properties.push(print("rest"));
      }
      return group([
        "{",
        indent([softline, join([",", line], properties)]),
        node.rest ? "" : ifBreak(","),
        softline,
        "}",
      ]);
    }
    case "MatchArrayPattern": {
      const elements = path.map(print, "elements");
      if (node.rest) {
        elements.push(print("rest"));
      }
      return group([
        "[",
        indent([softline, join([",", line], elements)]),
        node.rest ? "" : ifBreak(","),
        softline,
        "]",
      ]);
    }
    case "MatchObjectPatternProperty":
      if (node.shorthand) {
        return print("pattern");
      }
      return group([print("key"), ":", indent([line, print("pattern")])]);
    case "MatchRestPattern": {
      const parts = ["..."];
      if (node.argument) {
        parts.push(print("argument"));
      }
      return parts;
    }
  }
}
