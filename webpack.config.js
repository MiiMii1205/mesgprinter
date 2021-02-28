const path = require("path");
const buildPath = path.resolve(__dirname, "nui");
const sourceDir = path.resolve(__dirname, "nui", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    
    let isProd = argv.mode === "production";
    return {
        plugins : [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename : path.join("css", "index.css"),
                chunkFilename : path.join("css", "[id].css"),
                linkType : false
            })
        ],
        entry : path.join(sourceDir, "index.ts"),
        devtool : "inline-source-map",
        output : {
            path : buildPath,
            filename : path.join("scripts", "index.js")
        },
        externals : {
            twemoji : "twemoji",
            "markdown-it" : "markdownit"
        },
        resolve : {
            extensions : [
                ".tsx",
                ".ts",
                ".js",
                ".pug"
            ]
        },
        
        resolveLoader : {
            modules : [
                path.resolve(__dirname, "node_modules"),
                path.resolve(buildPath, "node_modules"),
                "node_modules"
            ]
        },
        
        optimization : {
            minimize : isProd
        },
        
        mode : "development",
        
        module : {
            rules : [
                {
                    test : /\.js$/,
                    use : ["source-map-loader"],
                    enforce : "pre"
                },
                
                {
                    test : /\.pug$/,
                    use : [
                        {
                            loader : "pug-loader",
                            options : {
                                pretty : !isProd
                            }
                        }
                    ]
                },
                
                {
                    test : /\.s[ac]ss$/i,
                    use : [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader : "sass-loader",
                            options : {
                                implementation : require("sass"),
                                sassOptions : {
                                    outputStyle : isProd ? "compressed" : "expanded"
                                }
                            }
                        }
                    ]
                },
                
                {
                    test : /\.(png|jpe?g|gif|otf)$/i,
                    type : "asset/resource"
                },
                
                {
                    test : /\.tsx?$/,
                    use : [
                        "ts-loader"
                    ],
                    exclude : /node_modules/
                }
            ]
        }
        
    };
};