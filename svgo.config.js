module.exports = {
  multipass: true,
  plugins: [
    {
      "preset-default": {
        overrides: {
          cleanupIDs: true,
          removeDoctype: true,
          removeComments: true,
        },
      },
    },
    {
      convertPathData: {
        floatPrecision: 2,
      },
    },
  ],
};
