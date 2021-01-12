const path = require('path');
const buildPath = path.resolve(__dirname, 'nui');
const sourceDir = path.resolve(__dirname, 'nui', 'src');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv)=> {
    return {
        entry : path.join(sourceDir, 'index.ts'),
        devtool : 'eval',
        output : {
            path : buildPath,
            filename : path.join('scripts', 'index.js')
        },
        
        resolve : {
            extensions : [
                '.tsx',
                '.ts',
                '.js',
                '.pug'
            ]
        },
    
        resolveLoader : {
            modules : [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(buildPath, 'node_modules'),
                'node_modules'
            ]
        },
    
        optimization : {
            minimize : (argv.mode !== 'production')
        },
    
        mode : 'development',
    
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
                                pretty : !(argv.mode !== 'production'),
                            }
                        }
                    ],
                },
            
                {
                    test : /\.s[ac]ss$/i,
                    use : [
                        argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader : "css-loader",
                        },
                        {
                            loader : "sass-loader",
                            options : {
                                implementation : require("sass"),
                                sassOptions : {
                                    outputStyle :  argv.mode === 'production' ? "compressed" : "expanded",
                                }
                            }
                        }
                    ]
                },
            
                {
                    test : /\.(png|jpe?g|gif|otf)$/i,
                    type : 'asset/resource'
                },
            
                {
                    test : /\.tsx?$/,
                    use : [
                        'ts-loader'
                    ],
                    exclude : /node_modules/,
                },
            ]
        },
    
        plugins : [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename : path.join('css', '[name].css'),
                chunkFilename : path.join('css', '[id].css'),
            }),
        ],
    };
}