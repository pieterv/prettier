run_spec(import.meta, ["flow"], {
  errors: {
    "babel-flow": [
      "component-declaration.js",
      "declare-component.js",
      "component-type-annotation.js",
    ],
  },
});
