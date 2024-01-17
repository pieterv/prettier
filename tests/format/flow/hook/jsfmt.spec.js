run_spec(import.meta, ["flow"], {
    errors: {
      "babel-flow": [
        "hook-declaration.js",
        "declare-hook.js",
        "hook-type-annotation.js",
      ],
    },
  });
