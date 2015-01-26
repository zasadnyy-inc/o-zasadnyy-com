---
layout: article
title: "Optimized Jekyll site with Grunt"
headline: "Developing sites with Jekyll is really simple, but with Grunt, you will get ecstasy."
date: 2015-01-18T21:12:17+02:00
estimate: "10 mins"
categories: [jekyll, grunt, web performance]
post: true
---

I have started developing static sites with [Jekyll](http://jekyllrb.com/) in May. For anyone who don't know what it is:

> Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through a converter (like Markdown) and our Liquid renderer, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server.

I liked the idea of modules in site project that eventually will generate static website. Furthermore [GitHub Pages](https://help.github.com/articles/using-jekyll-with-pages/) can generate and host it for you, so you get **free hosting** and **push to deploy** ideology.

That's why it was the perfect choice for [Project Zeppelin](https://github.com/gdg-x/zeppelin) - free site template for conferences (mostly GDG DevFest, but for sure you can use it as you want). Unfortunately there are limitations of using plug-ins with GitHub pages, so you can't use them, for example, to compile Compass files, minify css, js and html files or highlight your code.

Fortunately, [Grunt](http://gruntjs.com/) help us with it and gives even more. So let's get started.

#### Installation
First of all you need to install [Bundler](http://bundler.io/) for easier way to install gem dependencies

``` lineos:false
gem install bundler
```
Requirements: Install [Ruby](https://www.ruby-lang.org/en/) & [RubyGems](https://rubygems.org/)
{:.req}

Add these gems to your Gemfile

``` title:"Gemfile"
source "http://rubygems.org"

gem 'jekyll'
```
Run this command to install them

``` lineos:false
bundle install
```

And Grunt for sure

``` lineos:false
npm install -g grunt-cli
```
Requirements: Install [Node.js](http://nodejs.org/)
{:.req}

We are almost ready to use Grunt, but first of all you need to create **package.json**, that is used by npm and contains the dependencies for your project

``` title:"package.json"
{
    "name": "your-next-website",
    "version": "0.0.1",
    "description": "Dependencies of your next website",
    "author": "Name Surname",
    "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-autoprefixer": "~2.1.0",
        "grunt-build-control": "~0.2.2",
        "grunt-concurrent": "~1.0.0",
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
        "grunt-uncss": "~0.3.8",
        "grunt-usemin": "~3.0.0",
        "jit-grunt": "~0.9.0",
        "time-grunt": "~1.0.0"
    },
    "engines": {
        "node": ">=0.10.0"
    }
}
```
You can update dependencies with [amazing tool](https://www.npmjs.com/package/npm-check-updates). Simply install it `npm install -g npm-check-updates` and run `npm-check-updates -u`. This command will update all devDepencies to latest versions.
{:.h-tip}

To install them just run

``` lineos:false
npm install
```

#### The Grunt task configuration
Grunt allows us to define a couple of tasks and run them from the shell. They are defined in a Gruntfile.js. I have generated first Gruntfile with [Yeoman Generator](https://github.com/robwierzbowski/generator-jekyllrb), but then I edited to get the better result. So that it is what I got.

```js title:"Gruntfile.js"


```



![image]({{site.baseurl}}/img/posts/android-form-validation-right-way/z-validations-not-in-range.png){:.medium-width}

##### Useful links

*(I'll update lists every time I find related topics)*

- [Post about text input on d.android.com](http://developer.android.com/guide/topics/ui/controls/text.html)
