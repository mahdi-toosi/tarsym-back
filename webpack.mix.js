const mix = require('laravel-mix');

mix
    .stylus('resources/styles/main.styl', 'public/css')
    .copy('resources/images/', 'public/images')
    .copy('resources/styles/libs/fonts', 'public/fonts')
    // .js('resources/javascripts/main.js', 'public/js')
    // .copy('resources/styles/libs/leaflet.css', 'public/css/')
    .disableNotifications();
