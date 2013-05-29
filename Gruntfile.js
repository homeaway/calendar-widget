module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: "/* Copyright (c) 2010 HomeAway, Inc.\n* All rights reserved.  http://homeaway.github.io/calendar-widget/\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */",
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'sass/',
          cssDir: 'css/'
        }
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      css: {
        src: 'css/calendar-widget.css',
        dest: 'css/calendar-widget.min.css'
      }
    },
  });

  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default task(s).
  grunt.registerTask('default', ['compass', 'cssmin', 'uglify']);
};