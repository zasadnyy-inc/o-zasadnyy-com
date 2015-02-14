---
layout: article
title: "Optimized Jekyll site with Grunt"
headline: "Developing sites with Jekyll is really simple but with Grunt you will get ecstasy"
date: 2015-01-31T16:12:17+02:00
estimate: "15 mins"
categories: [jekyll, grunt, web performance]
post: true
---

I have started developing static sites with [Jekyll](http://jekyllrb.com/) in May. For everyone who don't know what it is:

> Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through a converter (like Markdown) and our Liquid renderer, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server.

I like the idea of modules in site project that eventually will generate static website. Furthermore [GitHub Pages](https://help.github.com/articles/using-jekyll-with-pages/) can generate and host it for you, so you get **free hosting** and **push to deploy** ideology.

That's why it was the perfect choice for [Project Zeppelin](https://github.com/gdg-x/zeppelin) - free site template for conferences (mostly for GDG DevFest, but for sure you can use it as you want). Unfortunately, there are limitations of using plug-ins with GitHub pages, so you can't use them, for example, to compile Compass files, minify css, js and html files or highlight your code.

Fortunately, [Grunt](http://gruntjs.com/) help us with it and gives even more. So let's get started.


#### Installation
First of all you need to install [Bundler](http://bundler.io/) for easier way to install gem dependencies.

``` lineos:false
gem install bundler
```
Requirements: Install [Ruby](https://www.ruby-lang.org/en/) & [RubyGems](https://rubygems.org/)
{:.req}

Add these gems to your Gemfile:

``` title:"Gemfile"
source "http://rubygems.org"

gem 'jekyll'
```
Run this command to install them:

``` lineos:false
bundle install
```

And don't forget to install Grunt:

``` lineos:false
npm install -g grunt-cli
```
Requirements: Install [Node.js](http://nodejs.org/)
{:.req}

We are almost ready to use Grunt, but before that you need to create **package.json**, which is used by npm and contains the dependencies for your project.

``` title:"package.json"
{
	"name": "your-next-website",
	"version": "0.0.1",
	"description": "Dependencies of your next website",
	"author": "Name Surname",
	"devDependencies": {
        "grunt": "~0.4.5",
        "grunt-autoprefixer": "~2.2.0",
        "grunt-build-control": "~0.3.0",
        "grunt-contrib-clean": "~0.6.0",
        "grunt-contrib-connect": "~0.9.0",
        "grunt-contrib-copy": "~0.7.0",
        "grunt-contrib-cssmin": "~0.11.0",
        "grunt-contrib-htmlmin": "~0.3.0",
        "grunt-contrib-imagemin": "~0.9.2",
        "grunt-contrib-uglify": "~0.7.0",
        "grunt-contrib-watch": "~0.6.1",
        "grunt-critical": "~0.1.1",
        "grunt-jekyll": "~0.4.2",
        "grunt-sass": "~0.17.0",
        "grunt-svgmin": "~2.0.0",
        "grunt-uncss": "~0.4.0",
    	"jit-grunt": "~0.9.0",
        "time-grunt": "~1.0.0"
    },
    "engines": {
        "node": ">=0.10.0"
    }
}
```
You can update dependencies with [amazing tool](https://www.npmjs.com/package/npm-check-updates). Simply install `npm install -g npm-check-updates` and run it with `npm-check-updates -u`. This command will update all devDepencies to the latest versions.
{:.h-tip}

To install them just run:

``` lineos:false
npm install
```

#### The Grunt task configuration
Grunt allows us to define a couple of tasks and run them from the shell. They are defined in a Gruntfile.js. I have generated first Gruntfile with [Yeoman Generator](https://github.com/robwierzbowski/generator-jekyllrb), but then I edited it to get the better result. So that it is what I got.

```js title:"Gruntfile.js"
'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({
        app: {
            app: 'app',
            dist: 'dist',
            baseurl: ''
        },
        watch: {
            sass: {
                files: ['<%= app.app %>/_assets/scss/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            scripts: {
                files: ['<%= app.app %>/_assets/js/**/*.{js}'],
                tasks: ['uglify']
            },
            jekyll: {
                files: [
                    '<%= app.app %>/**/*.{html,yml,md,mkd,markdown}'
                ],
                tasks: ['jekyll:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.jekyll/**/*.{html,yml,md,mkd,markdown}',
                    '.tmp/<%= app.baseurl %>/css/*.css',
                    '.tmp/<%= app.baseurl %>/js/*.js',
                    '<%= app.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
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
                        target: 'http://localhost:9000/<%= app.baseurl %>'
                    },
                    base: [
                        '.jekyll',
                        '.tmp',
                        '<%= app.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= app.baseurl %>'
                    },
                    base: [
                        '<%= app.dist %>',
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
                        '<%= app.dist %>/*',
                        '!<%= app.dist %>/.git*'
                    ]
                }]
            }
        },
        jekyll: {
            options: {
                config: '_config.yml,_config.build.yml',
                src: '<%= app.app %>'
            },
            dist: {
                options: {
                    dest: '<%= app.dist %>/<%= app.baseurl %>',
                }
            },
            server: {
                options: {
                    config: '_config.yml',
                    dest: '.jekyll/<%= app.baseurl %>'
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
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: '**/*.html',
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    '.tmp/<%= app.baseurl %>/js/scripts.js': ['<%= app.app %>/_assets/js/**/*.js']
                }
            }
        },
        sass: {
            server: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.app %>/_assets/scss',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/<%= app.baseurl %>/css',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.app %>/_assets/scss',
                    src: '**/*.{scss,sass}',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/css',
                    ext: '.css'
                }]
            }
        },
        uncss: {
            options: {
                htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
                report: 'gzip'
            },
            dist: {
                src: '<%= app.dist %>/<%= app.baseurl %>/**/*.html',
                dest: '.tmp/<%= app.baseurl %>/css/blog.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= app.baseurl %>/css',
                    src: '**/*.css',
                    dest: '.tmp/<%= app.baseurl %>/css'
                }]
            }
        },
        critical: {
            dist: {
                options: {
                    base: './',
                    css: [
                        '.tmp/<%= app.baseurl %>/css/blog.css'
                    ],
                    minify: true,
                    width: 320,
                    height: 480
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: ['**/*.html'],
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
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
                    cwd: '.tmp/<%= app.baseurl %>/css',
                    src: ['*.css'],
                    dest: '.tmp/<%= app.baseurl %>/css'
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
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/img',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/img',
                    src: '**/*.svg',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/img'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/<%= app.baseurl %>',
                    src: [
                        'css/**/*',
                        'js/**/*'
                    ],
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= app.dist %>/<%= app.baseurl %>',
                    remote: 'git@github.com:user/repo.git',
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
            'uglify',
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
        'cssmin',
        'uglify',
        'critical',
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
```

I have used **require('jit-grunt')(grunt);** to run tasks instead of **require('load-grunt-tasks')(grunt);** because it much faster (6 **ms** compared to 4,7 **s**).

In the project, I compile `.scss` files with [grunt-sass](https://github.com/sindresorhus/grunt-sass), which uses libsass which is a Sass compiler in C++, in purpose of performance. But there are [missing some features](http://sass-compatibility.github.io/). So if you need more stable compiler or Compass support use [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass).
{:.h-warning}

Running `grunt serve` (you can run it as default task `grunt`) on the command line will perform the following tasks:

* make Jekyll magic and compile your site to `.jekyll` folder;
* compile `.scss` files and autoprefix them;
* compile `.js` files;
* start a web server for you;
* watch your files and runs Grunt tasks when they are needed.

When you are ready to deploy it on a server (in my case on GitHub) run `grunt deploy`, which will do the next tasks:

* make Jekyll magic and compile your site to `.jekyll` folder;
* compress all images in `img` folder;
* compile `.sass` files, delete unnecessary css styles, autoprefix and compress them;
* compile and compress `.js` files;
* generate and insert [critical css](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#inline-render-blocking-css) into pages;
* compress `.html` pages;
* push changes into *gh-pages* branch of *git@github.com:user/repo.git* remote.

Final project structure looks like:

``` lineos:false
│   Gruntfile.js
│   package.json
│   _config.build.yml
│   _config.yml
│
└───app
	│   404.html
	│   CNAME
	│   feed.xml
	│   index.html
	│
	├───img
	│
	├───_assets
	│   ├───js
	│   └───scss
	│
	├───_data
	│
	├───_includes
	│
	├───_layouts
	│
	└───_posts
```

You can use my [template](https://github.com/ozasadnyy/optimized-jekyll-grunt) to start developing much faster.
{:.h-tip}

That's all. Now you can easily develop your site/blog with Jekyll and get highly optimized production version of it.
If you have some questions or suggestions feel free to comment here or send me a message directly.
