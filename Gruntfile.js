'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt, {
		buildcontrol: 'grunt-build-control'
	});

    grunt.initConfig({
        yeoman: {
            source: 'app',
            dist: 'dist',
            baseurl: ''
        },
        watch: {
            sass: {
                files: ['<%= yeoman.source %>/_assets/scss/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            scripts: {
                files: ['<%= yeoman.source %>/_assets/js/**/*.{js}'],
                tasks: ['uglify']
            },
            jekyll: {
                files: [
                    '<%= yeoman.source %>/**/*.{html,yml,md,mkd,markdown}'
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
                    '<%= yeoman.source %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
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
                        '<%= yeoman.source %>'
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
                config: '_config.yml,_config.build.yml',
                src: '<%= yeoman.source %>'
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
            }
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
                    '.tmp/<%= yeoman.baseurl %>/js/scripts.js': ['<%= yeoman.source %>/_assets/js/**/*.js']
                }
            }
        },
        sass: {
        	options: {
        		includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
        	},
            server: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.source %>/_assets/scss',
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
                    cwd: '<%= yeoman.source %>/_assets/scss',
                    src: '**/*.{scss,sass}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/css',
                    ext: '.css'
                }]
            }
        },
        uncss: {
            options: {
                htmlroot: '<%= yeoman.dist %>/<%= yeoman.baseurl %>',
                report: 'gzip'
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
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.baseurl %>/img/posts'
                },
                {
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
        }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'jekyll:server',
            'sass:server',
            'autoprefixer',
            // 'uglify',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jekyll:dist',
        'imagemin',
        'svgmin',
        'sass:dist',
        'uncss',
        'autoprefixer',
        'critical',
        'cssmin',
        // 'uglify',
        'htmlmin'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'copy',
        'buildcontrol'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
