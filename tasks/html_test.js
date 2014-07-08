/*
 * grunt-html-test
 * https://github.com/helloyou2012/grunt-html-test
 *
 * Copyright (c) 2014 学霸
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var colors = require('colors');

  var htmlTagCheck = function(source){
    var result = [];
    var tagsArray = [];
    var lines = source.split('\n');
    for (var x = 0; x < lines.length; x++){
        var tagsArray = lines[x].match(/<(\/{1})?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)>/g);
        if (tagsArray) {
            for (var i = 0; i < tagsArray.length; i++) {
                if (tagsArray[i].indexOf('</') >= 0) {
                    var elementToPop = tagsArray[i].substr(2, tagsArray[i].length-3);
                    elementToPop = elementToPop.replace(/ /g, '');                                                             
                    for (var j = result.length-1; j >= 0 ; j--) {
                        if (result[j].element == elementToPop) {
                            result.splice(j, 1);
                            break;
                        }
                    }
                } else {
                    var tag = {};
                    tag.full = tagsArray[i];
                    tag.line = x+1;
                    if (tag.full.indexOf(' ') > 0) {
                        tag.element = tag.full.substr(1, tag.full.indexOf(' ')-1);
                    } else {
                        tag.element = tag.full.substr(1, tag.full.length-2);
                    }
                    var selfClosingTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
                    var isSelfClosing = false;
                    for (var y = 0; y < selfClosingTags.length; y++) {
                        if (selfClosingTags[y].localeCompare(tag.element) == 0) {
                            isSelfClosing = true;
                        }
                    }
                    if (isSelfClosing == false) {
                        result.push(tag);
                    }
                }
                
            }
        }
    }
    return result;
  }

  grunt.registerMultiTask('html_test', 'For html tags check.', function() {
    var options = this.options();
    var errorCount = 0;

    // check if there are files to test
    if (this.filesSrc.length === 0) {
      grunt.log.writeln('No files to check...');
      grunt.log.ok();
      return;
    }else{
      this.filesSrc.forEach(function(filepath){
        grunt.log.writeln('');
        var errors = htmlTagCheck(grunt.file.read(filepath));
        if (errors.length===0) {
          grunt.log.writeln(('✔ ' + filepath).green);
        } else{
          errorCount++;
          grunt.log.writeln(('✗ ' + filepath).red);
          errors.forEach(function(error){
            grunt.log.writeln(('\t➜ ' + error.line + '# ' + error.full).red);
          });
        }
      });
    }
    
    if (errorCount > 0) { return false; }

  });

};
