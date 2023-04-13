
module.exports = {
    // chainWebpack: config => {
    //   config.resolve.alias
    //     .set("@", resolve("src"))
    //     .set("@components", resolve("src/components"))
    //     .set("@public", resolve("public"))
    //     .set("@images", resolve("public/images"));
    // },
    // publicPath: '/',
    devServer: {
        port: 9000,
        host: '0.0.0.0',
        https: false,
        open: true
    },
    lintOnSave: false
  }