module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');

    var lessFiles = {
        "dist/neo-light.css": "less/style.less",
        "dist/neo-development.css": "less/development.less"
    };

    var replaceFiles = [
        {src: ['dist/neo-light.css'], dest: 'dist/neo-light.css'},
        {src: ['dist/neo-development.css'], dest: 'dist/neo-development.css'}
    ];

    var cssMinFiles = {
        'dist/neo-light.css': ['dist/neo-light.css'],
        'dist/neo-development.css': ['dist/neo-development.css']
    };

    grunt.initConfig({
        clean: {
            dist: {
                src: ["dist/*"]
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    svgoPlugins: [{
                        removeDoctype: true,
                        removeXMLProcInst: true,
                        removeComments: true,
                        removeMetadata: true,
                        removeTitle: true,
                        removeDesc: true,
                        removeUselessDefs: true,
                        removeEditorsNSData: true,
                        removeEmptyAttrs: true,
                        removeHiddenElems: true,
                        removeEmptyText: true,
                        removeEmptyContainers: true,
                        removeViewBox: true,
                        cleanUpEnableBackground: true,
                        minifyStyles: true,
                        convertStyleToAttrs: true,
                        convertColors: true,
                        convertPathData: true,
                        convertTransform: true,
                        removeUnknownsAndDefaults: true,
                        removeNonInheritableGroupAttrs: true,
                        removeUselessStrokeAndFill: true,
                        removeUnusedNS: true,
                        cleanupIDs: true,
                        cleanupNumericValues: true,
                        moveElemsAttrsToGroup: true,
                        moveGroupAttrsToElems: true,
                        collapseGroups: true,
                        removeRasterImages: true,
                        mergePaths: true,
                        convertShapeToPath: true,
                        sortAttrs: true,
                        transformsWithOnePath: true,
                        removeDimensions: true,
                        removeAttrs: true,
                        addClassesToSVGElement: true,
                        removeStyleElement: true
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'node_modules/jenkins-core-theme/images/',
                    src: ['**/*.svg'],
                    dest: 'node_modules/jenkins-core-theme/images/'
                }]
            }

        },

        less: {
            dist: {
                files: lessFiles
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: pkg.version
                        }
                    ]
                },
                files: replaceFiles
            }
        },

        cssmin: {
            minify: {
                files: cssMinFiles
            }
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                    require('postcss-encode-base64-inlined-images'),
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'dist/neo-*.css'
            }
        },

        imageEmbed: {
            light: {
                src: ["dist/neo-light.css"],
                dest: "dist/neo-light.css",
                options: {
                    deleteAfterEncoding: false
                }
            },
            development: {
                src: ["dist/neo-development.css"],
                dest: "dist/neo-development.css",
                options: {
                    deleteAfterEncoding: false
                }
            }
        },

        fileExists: {
            scripts: Object.keys(lessFiles)
        },

        watch: {
            less: {
                files: ['less/*.less'],
                tasks: ['clean', 'less', 'replace', 'cssmin']
            },
            livereload: {
                options: { livereload: true },
                files: ['dist/*']
            }
        }
    });

    // Default task(s).
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['clean', 'imagemin', 'less', 'replace', 'cssmin', 'postcss']);
    grunt.registerTask('test', ['default', 'fileExists']);


};
