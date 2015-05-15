---
layout: article
title: "Run Grunt & Bower tasks during Maven build"
headline: "Organize frontend dependencies and optimize development in your Maven project"
date: 2015-02-17T22:50:23+02:00
estimate: "10 mins"
categories: [maven, grunt, bower]
post: true
---

Recently I have joined a new company as Java developer. One of my first tasks was to rewrite UI for one of the web applications.


#### Technology stack

Project was built with AngularJS, jQuery, Bootstrap, with manual dependency management and no resource optimizations. In other words, there were a lot of work to do.

In this article, I will show how to setup Maven project for frontend development. So let's get started.


#### Installation

To start with, we need to install Node.js, Bower, and Grunt. We'll use [frontend maven plugin][1] created by [Eirik Sletteberg][2].

> A Maven plugin that downloads/installs Node and NPM locally, runs NPM install, Grunt, Gulp and/or Karma. It's supposed to work on Windows, OS X, and Linux.

Include the Maven plugin to your project dependencies:

```xml title:"pom.xml"
<plugins>
    <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        <version>0.0.21</version>
        ...
    </plugin>
</plugins>
```

Inside `<executions>...</executions>` tag we define goals to install Node.js, npm with dependencies, Bower packages and run Grunt.
Resulting `pom.xml`:

```xml title:"pom.xml"
<plugins>
    <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        <version>0.0.21</version>

        <executions>

            <execution>
                <id>install node and npm</id>
                <goals>
                    <goal>install-node-and-npm</goal>
                </goals>
                <configuration>
                    <nodeVersion>v0.10.36</nodeVersion>
                    <npmVersion>2.4.1</npmVersion>
                </configuration>
            </execution>

            <execution>
                <id>npm install</id>
                <goals>
                    <goal>npm</goal>
                </goals>
                <configuration>
                    <arguments>install</arguments>
                </configuration>
            </execution>

            <execution>
                <id>bower install</id>
                <goals>
                    <goal>bower</goal>
                </goals>
                <configuration>
                    <arguments>install</arguments>
                </configuration>
            </execution>

            <execution>
                <id>grunt build</id>
                <goals>
                    <goal>grunt</goal>
                </goals>
                <configuration>
                    <arguments>build</arguments>
                </configuration>
            </execution>

        </executions>
    </plugin>
</plugins>
```

<div class="h-note" markdown="1">
Don't forget to update `.gitignore`, unless you actually want to commit node and dependencies, e.g.:

``` title:".gitignore"
target
node
node_modules
bower_components
```
</div>


Next  we'll set up project regeneration on file changes. One way to achieve this is to use [grunt-contrib-watch][3], but if you're using Eclipse, it's not going to work out of the box. We'll also need to setup M2E life-cycle mappings to support Eclipse incremental builds.

For this purpose, there are configuration options:

 - **srcdir** (optional, for M2Eclipse integration) - a directory to check for changed files before executing in an incremental build
 - **triggerfiles** (optional, for M2Eclipse integration) - a list of files to check for changes before executing in an incremental build
 - **outputdir** (optional, for M2Eclipse integration) - a directory to refresh when the build completes, so Eclipse sees changed files

Example:

```xml title:"pom.xml"
<configuration>
    <srcdir>${basedir}/src/main/sourceapp</srcdir>
    <outputdir>${basedir}/src/main/webapp</outputdir>
    <triggerfiles>
        <triggerfile>Gruntfile.js</triggerfile>
        <triggerfile>package.json</triggerfile>
    </triggerfiles>
    <arguments>${target.environment}</arguments>
</configuration>
```

`${target.environment}` variable depends on your [Maven profile][4]. For instance, we are using `<target.environment>serve</target.environment>` for development and `<target.environment>build</target.environment>` for production.

#### Grunt and Bower configuration

We have the next project structure:

```
|   pom.xml
|   package.json
|   bower.json
|   Gruntfile.js
|
+---src
|   \---main
|       +---sourceapp
|       |   +---js
|       |   |   |   controllers.js
|       |   |   |   app.js
|       |   |
|       |   \---scss
|       |       |   _base.scss
|       |       |   main.scss
|       |       |
|       |       +---modules
|       |       |       _utility.scss
|       |       |
|       |       +---partials
|       |       |       _helper.scss
|       |       |       _global.scss
|       |       |
|       |       \---vendor
|       |               _bootstrap-custom.scss
|       |
|       \---webapp
|           |   index.html
|           |
|           +---WEB-INF
|           |
|           +---html
|           |
|           +---fonts
|           |
|           +---img
|
+---bower_components
+---node_modules
\---node
```

With Bower, there is no need to update frontend libraries manually. All this boring work Bower is doing for you. Here is sample Bower configuration file:

``` title:"bower.json"
{
    "name": "frontend-project",
    "version": "0.0.1",
    "appPath": "src/main/webapp",
    "dependencies": {
        "modernizr": "2.7.1",
        "jquery": "2.1.1",
        "angular": "1.3.10",
        "angular-resource": "1.3.10",
        "angular-route": "1.3.10",
        "angular-material": "0.7.0",
        "angular-translate": "2.5.2"
    },
    "resolutions": {
        "angular": "1.3.10"
    }
}
```

To perform all tasks define npm dependencies in `package.json`:

``` title:"package.json"
{
    "name": "frontend-project",
    "version": "0.0.1",
    "description": "Description for frontend-project",
    "dependencies": {
        "bower": "~1.3.12",
        "grunt": "~0.4.5",
        "grunt-autoprefixer": "~2.2.0",
        "grunt-cli": "~0.1.13",
        "grunt-contrib-copy": "~0.7.0",
        "grunt-contrib-clean": "~0.6.0",
        "grunt-contrib-uglify": "~0.7.0",
        "grunt-sass": "~0.17.0",
        "jit-grunt": "~0.9.0",
        "time-grunt": "~1.0.0"
    },
    "engines": {
        "node": ">=0.10.0"
    }
}
```

Declare Grunt tasks in `Gruntfile.js`. For instance:

```  title:"Gruntfile.js"
'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);
    grunt
        .initConfig({
            app: {
                source: 'src/main/sourceapp',
                dist: 'src/main/webapp'
            },
            clean: {
                dist: ['.tmp', '<%= app.dist %>/css', '<%= app.dist %>/js']
            },
            copy: {
                css: {
                    files: [{
                        expand: true,
                        cwd: 'bower_components/angular-material/',
                        src: 'angular-material.css',
                        dest: '.tmp/scss/',
                        rename: function(dest, src) {
                            return dest + "_" + src.substring(0, src.indexOf('.')) + '.scss';
                        }
                    }]
                }
            },
            sass: {
                options: {
                    includePaths: [
                        'bower_components/bootstrap-sass/assets/stylesheets',
                        '.tmp/scss'
                    ]
                },
                server: {
                    options: {
                        sourceMap: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= app.source %>/scss',
                        src: '**/*.{scss,sass}',
                        dest: '.tmp/css',
                        ext: '.css'
                    }]
                },
                dist: {
                    options: {
                        outputStyle: 'compressed'
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= app.source %>/scss',
                        src: '**/*.{scss,sass}',
                        dest: '.tmp/css',
                        ext: '.css'
                    }]
                }
            },
            autoprefixer: {
                options: {
                    browsers: ['last 3 versions']
                },
                dist: {
                    files: [{
                        expand: true,
                        cwd: '.tmp/css',
                        src: '**/*.css',
                        dest: '<%= app.dist %>/css'
                    }]
                }
            },
            uglify: {
                server: {
                    options: {
                        mangle: false,
                        beautify: true
                    },
                    files: {
                        '<%= app.dist %>/js/scripts.js': [
                            'bower_components/jquery/dist/jquery.js',
                            'bower_components/angular/angular.js',
                            'bower_components/angular-resource/angular-resource.js',
                            'bower_components/angular-route/angular-route.js',
                            'bower_components/angular-animate/angular-animate.js',
                            'bower_components/angular-material/angular-material.js',
                            'bower_components/angular-translate/angular-translate.js'
                        ],

                        '<%= app.dist %>/js/app.js': [
                            '<%= app.source %>/js/app.js',
                            '<%= app.source %>/js/controllers.js'
                        ]
                    }
                },
                dist: {
                    options: {
                        compress: true,
                        preserveComments: false,
                        report: 'min'
                    },
                    files: {
                        '<%= app.dist %>/js/scripts.js': [
                            'bower_components/jquery/dist/jquery.js',
                            'bower_components/angular/angular.js',
                            'bower_components/angular-resource/angular-resource.js',
                            'bower_components/angular-route/angular-route.js',
                            'bower_components/angular-animate/angular-animate.js',
                            'bower_components/angular-material/angular-material.js',
                            'bower_components/angular-translate/angular-translate.js'
                        ],

                        '<%= app.dist %>/js/app.js': [
                            '<%= app.source %>/js/app.js',
                            '<%= app.source %>/js/controllers.js'
                        ]
                    }
                }
            }
        });

    grunt.registerTask('serve', ['clean', 'copy:css', 'sass:server',
        'autoprefixer', 'uglify:server'
    ]);
    grunt.registerTask('build', ['clean', 'copy:css', 'sass:dist',
        'autoprefixer', 'uglify:dist'
    ]);

    grunt.registerTask('default', ['build']);
};

```

<div class="h-tip" markdown="1">

With this hack, you can include a regular `.css` file in your `.scss`.

```
copy: {
    css: {
        files: [{
            expand: true,
            cwd: 'bower_components/angular-material/',
            src: 'angular-material.css',
            dest: '.tmp/scss/',
            rename: function(dest, src) {
                return dest + "_" + src.substring(0, src.indexOf('.')) + '.scss';
            }
        }]
    }
}
```
</div>

Hooray! We are ready to start developing UI without headache. Maybe, it is not the best example, but it shows you how to use frontend maven plugin, install dependencies and define tasks for frontend development.

Feel free to comment this article and express your opinion about this.



[1]: https://github.com/eirslett/frontend-maven-plugin

[2]: https://github.com/eirslett

[3]: https://github.com/gruntjs/grunt-contrib-watch

[4]: http://maven.apache.org/guides/introduction/introduction-to-profiles.html
