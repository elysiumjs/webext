const withWorkers = require("@zeit/next-workers");

module.exports = (phase, { defaultConfig }) => {
    const config = {
        ...defaultConfig,
        reactStrictMode: true,
    };
    config.webpack = (
        config,
        { buildId, dev, isServer, defaultLoaders, webpack }
    ) => {
        // config.output.globalObject = "self";
        return config;
    };
    // config.future = { webpack5: true };
    config.workerLoaderOption = { inline: true };
    return withWorkers(config);
};
