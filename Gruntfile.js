'use strict';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-istanbul');
    
  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
      index: {
        src: 'index.js'
      }
    },
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      index: {
        files: '<%= jshint.index.src %>',
        tasks: ['jshint:index']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    },
      env: {
	  coverage: {
	      LIB_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/lib/'
	  }
      },
      instrument: {
	  files: 'lib/**/*.js',
	  options: {
	      lazy: true,
	      basePath: 'test/coverage/instrument/'
	  }
      },
      storeCoverage: {
	  options: {
	      dir: 'test/coverage/reports'
	  }
      },
      makeReport: {
	  src: 'test/coverage/reports/**/*.json',
	  options: {
	      type: 'lcov',
	      dir: 'test/coverage/reports',
	      print: 'detail'
	  }
      },
      coveralls: { src: 'test/coverage/reports/*.lcov' }
  });

    // Default task.
    grunt.registerTask('default', ['jshint', 'mochacli']);
    grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochacli',
				    'storeCoverage', 'makeReport', 'coveralls']);
};
