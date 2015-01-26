'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({
        yeoman: {
            app: 'app',
            dist: 'dist',
            baseurl: ''
        },
        watch: {
            sass: {
                files: ['<%= yeoman.app %>/_assets/scss/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer:dist']
            },
            scripts: {
                files: ['<%= yeoman.app %>/_assets/js/**/*.{js}'],
                tasks: ['uglify:server']
            },
            jekyll: {
                files: [
                    '<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}',
                    '<%= yeoman.app %>/*.{html,yml,md,mkd,markdown}'
                ],
                tasks: ['jekyll:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.jekyll/**/*.{html,yml,md,mkd,markdown}',
                    '.tmp/<%= yeoman.baseurl %>/css/*.css',
                    '.tmp/<%= yeoman.baseurl %>/js/*.js',
                    '<%= yeoman.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= yeoman.baseurl %>'
                    },
                    base: [
                        '.jekyll',
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= yeoman.baseurl %>'
                    },
                    base: [
                        '<%= yeoman.dist %>',
                        '.tmp'
                    ]
                }
            }
        },
        clean: {
            server: [
                '.jekyll',
                '.tmp'
            ],
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            }
        },
        jekyll: {
            options: {
                // bundleExec: true,
                config: '_config.yml,_config.build.yml',
                src: '<%= yeoman.app %>'
            },
            dist: {
                options: {
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                }
            },
            server: {
                options: {
                    config: '_config.yml',
                    dest: '.jekyll/<%= yeoman.baseurl %>'
                }
            },
            check: {
                options: {
                    doctor: true
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>'
            },
            html: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
            },
            html: ['<%= yeoman.dist %>/<%= yeoman.baseurl %>/**/*.html'],
            css: ['<%= yeoman.dist %>/<%= yeoman.baseurl %>/css/**/*.css']
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                    src: '**/*.html',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>'
                }]
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    '.tmp/<%= yeoman.baseurl %>/js/scripts.js': ['<%= yeoman.app %>/_assets/js/**/*.js']
                }
            }
        },
        sass: {
            options: {
                includePaths: ['<%= yeoman.app %>/_assets/scss']
            },
            server: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/_assets/scss',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/<%= yeoman.baseurl %>/css',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/_assets/scss',
                    src: '**/*.{scss,sass}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/css',
                    ext: '.css'
                }]
            }
        },
        // uncss: {
        //     dist: {
        //         options: {
        //             // csspath: '../../.tmp',
        //             stylesheets: ['../../../.tmp/<%= yeoman.baseurl %>/css/blog.css'],
        //             // htmlroot: '<%= yeoman.dist %>/<%= yeoman.baseurl %>'
        //             report: 'min'
        //         },
        //         files: {
        //             '.tmp/<%= yeoman.baseurl %>/css/blog.css': ['<%= yeoman.dist %>/<%= yeoman.baseurl %>/**/*.html']
        //         }
        //     }
        // },
        uncss: {
            options: {
                // csspath: '../.tmp/',
                // stylesheets: ['.tmp/<%= yeoman.baseurl %>/css/blog.css'],
                htmlroot: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                report: 'min'
            },
            dist: {
                src: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/**/*.html',
                dest: '.tmp/<%= yeoman.baseurl %>/css/blog.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= yeoman.baseurl %>/css',
                    src: '**/*.css',
                    dest: '.tmp/<%= yeoman.baseurl %>/css'
                }]
            }
        },
        critical: {
            dist: {
                options: {
                    base: './',
                    css: [
                        '.tmp/<%= yeoman.baseurl %>/css/blog.css'
                    ],
                    minify: true,
                    width: 320,
                    height: 480
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                    src: ['**/*.html'],
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0,
                    check: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= yeoman.baseurl %>/css',
                    src: ['*.css'],
                    dest: '.tmp/<%= yeoman.baseurl %>/css'
                }]
            }
        },
        imagemin: {
            options: {
                progressive: true
            },
            posts: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts'
                }]
            },
            slides: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/slides',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/slides'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts',
                    src: '**/*.svg',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/<%= yeoman.baseurl %>',
                    src: [
                        'css/**/*',
                        'js/**/*'
                    ],
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                    remote: 'git@github.com:zasadnyy-inc/o-zasadnyy-com.git',
                    branch: 'gh-pages',
                    commit: true,
                    push: true,
                    connectCommits: false
                }
            }
        },
        concurrent: {
            server: [
                'jekyll:server'
            ],
            dist: [
                'copy:dist'
            ]
        }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'sass:server',
            'jekyll:server',
            'autoprefixer:dist',
            // 'uglify:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });


    grunt.registerTask('build', [
        'clean',
        'jekyll:dist',
        'imagemin',
        'svgmin',
        // 'uglify:dist',
        'sass:dist',
        'uncss',
        'autoprefixer:dist',
        'critical:dist',
        // 'useminPrepare',
        'usemin',
        'cssmin',
        'htmlmin'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'concurrent:dist',
        'buildcontrol'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
