runFormatTest(import.meta, ["flow"], {
  errors: {
    "babel-flow": [
      "component-declaration.js",
      "declare-component.js",
      "component-type-annotation.js",
    ],
  },
});
