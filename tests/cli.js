"use strict";

var path  = require("path");
var sinon = require("sinon");
var fsUtils = require("../src/fs-utils");

var cliPath = path.resolve(__dirname, "../src/cli.js");
var cli;

exports.setUp = function(done) {
  this.sinon = sinon.createSandbox();

  // The CLI module maintains some internal state in order to optimize
  // filesystem operations. This state can lead to undesirable test case
  // interdependencies. While re-loading the CLI module for every test may
  // negatively effect the execution time of this test suite, it is the most
  // maintainable way to avoid any current or future problems relating to
  // shared internal state.
  cli = require("../src/cli.js");

  done();
};

exports.tearDown = function(done) {
  this.sinon.restore();

  cli = null;
  delete require.cache[cliPath];

  done();
};

exports.group = {
  setUp: function (cb) {
    this.sinon.stub(cli, "exit");
    cb();
  },

  config: {
    setUp: function (done) {
      this.sinon.stub(fsUtils, "readFile")
        .withArgs(sinon.match(/file\.js$/))
          .returns("var a = function () {}; a();")
        .withArgs(sinon.match(/file1\.json$/))
          .returns("wat")
        .withArgs(sinon.match(/file2\.json$/))
          .returns("{\"node\":true,\"globals\":{\"foo\":true,\"bar\":true}}")
        .withArgs(sinon.match(/file4\.json$/))
          .returns("{\"extends\":\"file3.json\"}")
        .withArgs(sinon.match(/file5\.json$/))
          .returns("{\"extends\":\"file2.json\"}")
        .withArgs(sinon.match(/file6\.json$/))
          .returns("{\"extends\":\"file2.json\",\"node\":false}")
        .withArgs(sinon.match(/file7\.json$/))
          .returns("{\"extends\":\"file2.json\",\"globals\":{\"bar\":false,\"baz\":true}}")
        .withArgs(sinon.match(/file8\.json$/)).returns(JSON.stringify({
          extends: "file7.json",
          overrides: {
            "file.js": {
              globals: {
                foo: true,
                bar: true
              }
            }
          }
        }))
        .withArgs(sinon.match(/file9\.json$/)).returns(JSON.stringify({
          extends: "file8.json",
          overrides: {
            "file.js": {
              globals: {
                baz: true,
                bar: false
              }
            }
          }
        }));

      this.sinon.stub(fsUtils, "exists")
        .withArgs(sinon.match(/file\.js$/)).returns(true)
        .withArgs(sinon.match(/file1\.json$/)).returns(true)
        .withArgs(sinon.match(/file2\.json$/)).returns(true)
        .withArgs(sinon.match(/file3\.json$/)).returns(false)
        .withArgs(sinon.match(/file4\.json$/)).returns(true)
        .withArgs(sinon.match(/file5\.json$/)).returns(true)
        .withArgs(sinon.match(/file6\.json$/)).returns(true);

      this.out = this.sinon.stub(console, "error");

      done();
    },

    normal: function (test) {
      this.sinon.stub(cli, "run").returns(true);

      // Merges existing valid files
      cli.interpret([
        "node", "jshint", "file.js", "--config", "file5.json"
      ]);
      test.equal(cli.run.lastCall.args[0].config.node, true);
      test.equal(cli.run.lastCall.args[0].config['extends'], void 0);

      // Overwrites options after extending
      cli.interpret([
        "node", "jshint", "file.js", "--config", "file6.json"
      ]);
      test.equal(cli.run.lastCall.args[0].config.node, false);

      // Valid config
      cli.interpret([
        "node", "jshint", "file.js", "--config", "file2.json"
      ]);

      // Performs a deep merge of configuration
      cli.interpret([
        "node", "jshint", "file2.js", "--config", "file7.json"
      ]);
      test.deepEqual(cli.run.lastCall.args[0].config.globals, { foo: true, bar: false, baz: true });

      // Performs a deep merge of configuration with overrides
      cli.interpret([
        "node", "jshint", "file.js", "--config", "file8.json"
      ]);
      test.deepEqual(cli.run.lastCall.args[0].config.overrides["file.js"].globals, { foo: true, bar: true });

      // Performs a deep merge of configuration with overrides for the same glob
      cli.interpret([
        "node", "jshint", "file.js", "--config", "file9.json"
      ]);
      test.deepEqual(cli.run.lastCall.args[0].config.overrides["file.js"].globals, { foo: true, bar: false, baz: true });

      test.done();
    },

    failure: function (test) {
      var out = this.out;
      cli.exit.throws("ProcessExit");

      // File doesn't exist.
      try {
        cli.interpret([
          "node", "jshint", "file.js", "--config", "file3.json"
        ]);
      } catch (err) {
        var msg = out.args[0][0];
        test.equal(msg.slice(0, 23), "Can't find config file:");
        test.equal(msg.slice(msg.length - 10), "file3.json");
        test.equal(err, "ProcessExit");
      }

      // Invalid config
      try {
        cli.interpret([
          "node", "jshint", "file.js", "--config", "file1.json"
        ]);
      } catch (err) {
        var msg = out.args[1][0];
        test.equal(msg.slice(0, 24), "Can't parse config file:");
        test.equal(msg.slice(25, 35), "file1.json");
        test.equal(err, "ProcessExit");
      }

      // Invalid merged filed
      try {
        cli.interpret([
          "node", "jshint", "file.js", "--config", "file4.json"
        ]);
      } catch (err) {
        var msg = out.args[2][0];
        test.equal(msg.slice(0, 23), "Can't find config file:");
        test.equal(msg.slice(msg.length - 10), "file3.json");
        test.equal(err, "ProcessExit");
      }


      test.done();
    }
  },

  testPrereq: function (test) {
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file\.js$/)).returns("a();")
      .withArgs(sinon.match(/prereq.js$/)).returns("var a = 1;")
      .withArgs(sinon.match(/config.json$/))
        .returns("{\"undef\":true,\"prereq\":[\"prereq.js\", \"prereq2.js\"]}");

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file\.js$/)).returns(true)
      .withArgs(sinon.match(/prereq.js$/)).returns(true)
      .withArgs(sinon.match(/config.json$/)).returns(true);

    cli.exit.withArgs(0).returns(true)
      .withArgs(2).throws("ProcessExit");

    cli.interpret([
      "node", "jshint", "file.js", "--config", "config.json"
    ]);

    fsUtils.readFile.restore();
    fsUtils.exists.restore();

    test.done();
  },

  // CLI prereqs
  testPrereqCLIOption: function (test) {
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file\.js$/)).returns("a();")
      .withArgs(sinon.match(/prereq.js$/)).returns("var a = 1;")
      .withArgs(sinon.match(/config.json$/)).returns("{\"undef\":true}");

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file\.js$/)).returns(true)
      .withArgs(sinon.match(/prereq.js$/)).returns(true)
      .withArgs(sinon.match(/config.json$/)).returns(true);

    cli.exit.restore();
    this.sinon.stub(cli, "exit")
      .withArgs(0).returns(true)
      .withArgs(2).throws("ProcessExit");

    cli.interpret([
      "node", "jshint", "file.js",
      "--config", "config.json",
      "--prereq", "prereq.js  , prereq2.js"
    ]);

    fsUtils.readFile.restore();
    fsUtils.exists.restore();

    test.done();
  },

  // CLI prereqs should get merged with config prereqs
  testPrereqBothConfigAndCLIOption: function (test) {
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file\.js$/)).returns("a(); b();")
      .withArgs(sinon.match(/prereq.js$/)).returns("var a = 1;")
      .withArgs(sinon.match(/prereq2.js$/)).returns("var b = 2;")
      .withArgs(sinon.match(/config.json$/))
        .returns("{\"undef\":true,\"prereq\":[\"prereq.js\"]}");

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file\.js$/)).returns(true)
      .withArgs(sinon.match(/prereq.js$/)).returns(true)
      .withArgs(sinon.match(/prereq2.js$/)).returns(true)
      .withArgs(sinon.match(/config.json$/)).returns(true);

    cli.exit.restore();
    this.sinon.stub(cli, "exit")
      .withArgs(0).returns(true)
      .withArgs(2).throws("ProcessExit");

    cli.interpret([
      "node", "jshint", "file.js",
      "--config", "config.json",
      "--prereq", "prereq2.js,prereq3.js"
    ]);

    fsUtils.readFile.restore();
    fsUtils.exists.restore();

    test.done();
  },

  // Overrides should work for files in the current directory
  testOverrides: function (test) {
    var dir = __dirname + "/../examples/";
    var rep = require("../examples/reporter.js");
    var config = {
      "asi": true,
      "overrides": {
        "bar.js": {
          "asi": false
        }
      }
    };

    this.sinon.stub(process, "cwd").returns(dir);
    this.sinon.stub(rep, "reporter");
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/foo\.js$/)).returns("a()")
      .withArgs(sinon.match(/bar\.js$/)).returns("a()")
      .withArgs(sinon.match(/config\.json$/))
        .returns(JSON.stringify(config));

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/foo\.js$/)).returns(true)
      .withArgs(sinon.match(/bar\.js$/)).returns(true)
      .withArgs(sinon.match(/config\.json$/)).returns(true);

    cli.exit.withArgs(0).returns(true)
      .withArgs(1).throws("ProcessExit");

    // Test successful file
    cli.interpret([
      "node", "jshint", "foo.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[0][0].length === 0);

    // Test overridden, failed file
    cli.interpret([
      "node", "jshint", "bar.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[1][0].length === 1, "Error was expected but not thrown");
    test.equal(rep.reporter.args[1][0][0].error.code, "W033");

    test.done();
  },

  // Overrides should work for implicit relative paths (without a leading ./)
  testOverridesMatchesImplicitRelativePaths: function (test) {
    var dir = __dirname + "/../examples/";
    var rep = require("../examples/reporter.js");
    var config = {
      "asi": true,
      "overrides": {
        "src/bar.js": {
          "asi": false
        }
      }
    };

    this.sinon.stub(process, "cwd").returns(dir);
    this.sinon.stub(rep, "reporter");
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/foo\.js$/)).returns("a()")
      .withArgs(sinon.match(/bar\.js$/)).returns("a()")
      .withArgs(sinon.match(/config\.json$/))
        .returns(JSON.stringify(config));

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/foo\.js$/)).returns(true)
      .withArgs(sinon.match(/bar\.js$/)).returns(true)
      .withArgs(sinon.match(/config\.json$/)).returns(true);

    cli.exit.withArgs(0).returns(true)
      .withArgs(1).throws("ProcessExit");

    // Test successful file
    cli.interpret([
      "node", "jshint", "src/foo.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[0][0].length === 0);

    // Test overridden, failed file
    cli.interpret([
      "node", "jshint", "src/bar.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[1][0].length === 1, "Error was expected but not thrown");
    test.equal(rep.reporter.args[1][0][0].error.code, "W033");

    test.done();
  },

  // Overrides should work for explicit relative paths (with a leading ./)
  testOverridesMatchesExplicitRelativePaths: function (test) {
    var dir = __dirname + "/../examples/";
    var rep = require("../examples/reporter.js");
    var config = {
      "asi": true,
      "overrides": {
        "src/bar.js": {
          "asi": false
        }
      }
    };

    this.sinon.stub(process, "cwd").returns(dir);
    this.sinon.stub(rep, "reporter");
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/foo\.js$/)).returns("a()")
      .withArgs(sinon.match(/bar\.js$/)).returns("a()")
      .withArgs(sinon.match(/config\.json$/))
        .returns(JSON.stringify(config));

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/foo\.js$/)).returns(true)
      .withArgs(sinon.match(/bar\.js$/)).returns(true)
      .withArgs(sinon.match(/config\.json$/)).returns(true);

    cli.exit.withArgs(0).returns(true)
      .withArgs(1).throws("ProcessExit");

    // Test successful file
    cli.interpret([
      "node", "jshint", "./src/foo.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[0][0].length === 0);

    // Test overridden, failed file
    cli.interpret([
      "node", "jshint", "./src/bar.js", "--config", "config.json", "--reporter", "reporter.js"
    ]);
    test.ok(rep.reporter.args[1][0].length === 1, "Error was expected but not thrown");
    test.equal(rep.reporter.args[1][0][0].error.code, "W033");

    test.done();
  },

  testReporter: function (test) {
    test.expect(5);

    var rep = require("../examples/reporter.js");
    var out = this.sinon.stub(console, "error");
    var dir = __dirname + "/../examples/";
    this.sinon.stub(process, "cwd").returns(dir);

    cli.exit.throws("ProcessExit");

    // Test failed attempt.
    try {
      cli.interpret([
        "node", "jshint", "file.js", "--reporter", "invalid.js"
      ]);
    } catch (err) {
      var msg = out.args[0][0];
      test.equal(msg.slice(0, 25), "Can't load reporter file:");
      test.equal(msg.slice(msg.length - 10), "invalid.js");
      test.equal(err, "ProcessExit");
    }

    // Test successful attempt.
    // run.restore();
    this.sinon.stub(rep, "reporter");
    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file\.js$/)).returns(true);

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file\.js$/)).returns("func()");

    try {
      cli.interpret([
        "node", "jshint", "file.js", "--reporter", "reporter.js"
      ]);
    } catch (err) {
      if (err.name !== "ProcessExit") {
        throw err;
      }

      test.equal(rep.reporter.args[0][0][0].error.raw, "Missing semicolon.");
      test.ok(rep.reporter.calledOnce);
    }

    test.done();
  },

  testJSLintReporter: function (test) {
    var rep = require("../src/reporters/jslint_xml.js");
    var run = this.sinon.stub(cli, "run");

    cli.interpret([
      "node", "jshint", "file.js", "--reporter", "jslint"
    ]);
    test.equal(run.args[0][0].reporter, rep.reporter);

    test.done();
  },

  testCheckStyleReporter: function (test) {
    var rep = require("../src/reporters/checkstyle.js");
    var run = this.sinon.stub(cli, "run");

    cli.interpret([
      "node", "jshint", "file.js", "--reporter", "checkstyle"
    ]);
    test.equal(run.args[0][0].reporter, rep.reporter);

    test.done();
  },

  testShowNonErrors: function (test) {
    var rep = require("../src/reporters/non_error.js");
    var run = this.sinon.stub(cli, "run");

    cli.interpret([
      "node", "jshint", "file.js", "--show-non-errors"
    ]);
    test.equal(run.args[0][0].reporter, rep.reporter);

    test.done();
  },

  testExtensions: function (test) {
    var run = this.sinon.stub(cli, "run");

    cli.interpret([
      "node", "jshint", "file.js"
    ]);
    test.equal(run.args[0][0].extensions, "");

    cli.interpret([
      "node", "jshint", "file.js", "--extra-ext", ".json"
    ]);
    test.equal(run.args[1][0].extensions, ".json");

    test.done();
  },

  testMalformedNpmFile: function (test) {
    this.sinon.stub(process, "cwd").returns(__dirname);
    var localNpm = path.normalize(__dirname + "/package.json");
    var localRc = path.normalize(__dirname + "/.jshintrc");
    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub rc file
    existsStub.withArgs(localRc).returns(true);
    readFileStub.withArgs(localRc).returns('{"evil": true}');

    // stub npm file
    existsStub.withArgs(localNpm).returns(true);
    readFileStub.withArgs(localNpm).returns('{'); // malformed package.json

    // stub src file
    existsStub.withArgs(sinon.match(/file\.js$/)).returns(true);
    readFileStub.withArgs(sinon.match(/file\.js$/)).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", "file.js"
    ]);
    test.equal(cli.exit.args[0][0], 0); // lint with wrong package.json

    test.done();
  },

  testRcFile: function (test) {
    this.sinon.stub(process, "cwd").returns(__dirname);
    var localRc = path.normalize(__dirname + "/.jshintrc");
    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub rc file
    existsStub.withArgs(localRc).returns(true);
    readFileStub.withArgs(localRc).returns('{"evil": true}');

    // stub src file
    existsStub.withArgs(sinon.match(/file\.js$/)).returns(true);
    readFileStub.withArgs(sinon.match(/file\.js$/)).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", "file.js"
    ]);
    test.equal(cli.exit.args[0][0], 0); // eval allowed = rc file found

    test.done();
  },

  testHomeRcFile: function (test) {
    var home = process.env.HOME || process.env.HOMEPATH;
    var homeRc = path.join(home, ".jshintrc");
    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub home directory
    existsStub.withArgs(home).returns(true);

    // stub rc file
    existsStub.withArgs(homeRc).returns(true);
    readFileStub.withArgs(homeRc).returns('{"evil": true}');

    // stub src file (in root where we are unlikely to find a .jshintrc)
    existsStub.withArgs(sinon.match(/\/file\.js$/)).returns(true);
    readFileStub.withArgs(sinon.match(/\/file\.js$/)).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", "/file.js"
    ]);
    test.equal(cli.exit.args[0][0], 0); // eval allowed = rc file found

    test.done();
  },

  testNoHomeDir: function (test) {
    var prevEnv = {};

    // Remove all home dirs from env.
    [ 'USERPROFILE', 'HOME', 'HOMEPATH' ].forEach(function (key) {
      prevEnv[key] = process.env[key];
      delete process.env[key];
    });

    this.sinon.stub(process, "cwd").returns(__dirname);
    var localRc = path.normalize(__dirname + "/.jshintrc");
    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub rc file
    existsStub.withArgs(localRc).returns(true);
    readFileStub.withArgs(localRc).returns('{"evil": true}');

    // stub src file
    existsStub.withArgs(sinon.match(/file\.js$/)).returns(true);
    readFileStub.withArgs(sinon.match(/file\.js$/)).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", "file.js"
    ]);
    test.equal(cli.exit.args[0][0], 0); // eval allowed = rc file found

    test.done();

    // Restore environemnt
    Object.keys(prevEnv).forEach(function (key) {
      process.env[key] = prevEnv[key];
    });
  },

  testOneLevelRcLookup: function (test) {
    var srcDir = __dirname + "../src/";
    var parentRc = path.join(srcDir, ".jshintrc");

    var cliDir = path.join(srcDir, "cli/");
    this.sinon.stub(process, "cwd").returns(cliDir);

    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub rc file
    existsStub.withArgs(parentRc).returns(true);
    readFileStub.withArgs(parentRc).returns('{"evil": true}');

    // stub src file
    existsStub.withArgs(sinon.match(/file\.js$/)).returns(true);
    readFileStub.withArgs(sinon.match(/file\.js$/)).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", "file.js"
    ]);
    test.equal(cli.exit.args[0][0], 0); // eval allowed = rc file found

    test.done();
  },

  testTargetRelativeRcLookup: function (test) {
    // working from outside the project
    this.sinon.stub(process, "cwd").returns(process.env.HOME || process.env.HOMEPATH);
    var projectRc = path.normalize(__dirname + "/.jshintrc");
    var srcFile = __dirname + "/sub/file.js";
    var existsStub = this.sinon.stub(fsUtils, "exists");
    var readFileStub = this.sinon.stub(fsUtils, "readFile");

    // stub rc file
    existsStub.withArgs(projectRc).returns(true);
    readFileStub.withArgs(projectRc).returns('{"evil": true}');

    // stub src file
    existsStub.withArgs(srcFile).returns(true);
    readFileStub.withArgs(srcFile).returns("eval('a=2');");

    cli.interpret([
      "node", "jshint", srcFile
    ]);
    test.equal(cli.exit.args[0][0], 0); // eval allowed = rc file found

    test.done();
  },

  testIgnores: function (test) {
    var run = this.sinon.stub(cli, "run");
    var dir = __dirname + "/../examples/";
    this.sinon.stub(process, "cwd").returns(dir);

    cli.interpret([
      "node", "jshint", "file.js", "--exclude=exclude.js"
    ]);

    test.equal(run.args[0][0].ignores[0], path.resolve(dir, "exclude.js"));
    test.equal(run.args[0][0].ignores[1], path.resolve(dir, "ignored.js"));
    test.equal(run.args[0][0].ignores[2], path.resolve(dir, "another.js"));

    run.restore();
    process.cwd.returns(__dirname + "/../");

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file.js$/)).returns("console.log('Hello');")
      .withArgs(sinon.match(/\.jshintignore$/)).returns("examples");

    test.equal(fsUtils.readFile.args.length, 0);

    test.done();
  },

  testIgnoresWithSpecialChars: function (test) {
    this.sinon.stub(process, "cwd").returns(path.resolve(__dirname, "special++chars"));
    this.sinon.stub(fsUtils, "exists").withArgs(".").returns(true);
    this.sinon.stub(fsUtils, "isDirectory").withArgs(".").returns(true);
    this.sinon.stub(fsUtils, "readDirectory").withArgs(".").returns([]);
    test.doesNotThrow(function() {
      cli.interpret(["node", "jshint", ".", "--exclude=exclude1.js"]);
    });
    test.done();
  },

  testMultipleIgnores: function (test) {
    var run = this.sinon.stub(cli, "run");
    var dir = __dirname + "/../examples/";
    this.sinon.stub(process, "cwd").returns(dir);

    cli.interpret([
      "node", "jshint", "file.js", "--exclude=foo.js,bar.js"
    ]);

    test.equal(run.args[0][0].ignores[0], path.resolve(dir, "foo.js"));
    test.equal(run.args[0][0].ignores[1], path.resolve(dir, "bar.js"));

    test.done();
  },

  // See gh-3187
  testIgnoreWithDot: function (test) {
    var dir = __dirname + "/../examples/";
    this.sinon.stub(process, "cwd").returns(dir);

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file\.js$/)).returns("This is not Javascript.")
      .withArgs(sinon.match(/\.jshintignore$/)).returns("**/ignored-dir/**");
    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file\.js$/)).returns(true)
      .withArgs(sinon.match(/\.jshintignore$/)).returns(true);

    cli.interpret([
      "node", "jshint", "ignored-dir/.dot-prefixed/file.js",
      "ignored-dir/not-dot-prefixed/file.js"
    ]);

    process.cwd.returns(__dirname + "/../");

    test.equal(cli.exit.args[0][0], 0, "All matching files are ignored, regardless of dot-prefixed directories.");

    test.done();
  },

  testExcludePath: function (test) {
    var run = this.sinon.stub(cli, "run");
    var dir = __dirname + "/../examples/";
    this.sinon.stub(process, "cwd").returns(dir);

    cli.interpret([
      "node", "jshint", "file.js", "--exclude-path=../examples/.customignore"
    ]);

    test.equal(run.args[0][0].ignores[0], path.resolve(dir, "exclude.js"));

    run.restore();
    process.cwd.returns(__dirname + "/../");

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file.js$/)).returns("console.log('Hello');")
      .withArgs(sinon.match(/\.jshintignore$/)).returns("examples");

    test.equal(fsUtils.readFile.args.length, 0);

    test.done();
  },

  testAPIIgnores: function (test) {
    var dir = __dirname + "/../data/";
    this.sinon.stub(process, "cwd").returns(dir);
    var result = null;

    cli.run({
      args: [dir + "../tests/unit/fixtures/ignored.js"],
      cwd: dir + "../tests/unit/fixtures/",
      reporter: function (results) { result = results; }
    });

    test.deepEqual(result, []);

    test.done();
  },

  testCollectFiles: function (test) {
    var gather = this.sinon.stub(cli, "gather");
    var args = [];

    gather.returns([]);

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/.*/)).returns(true);
    this.sinon.stub(fsUtils, "isDirectory");

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file2?\.js$/)).returns("console.log('Hello');")
      .withArgs(sinon.match(/ignore[\/\\]file\d\.js$/)).returns("console.log('Hello, ignore me');")
      .withArgs(sinon.match(/ignore[\/\\]dir[\/\\]file\d\.js$/)).returns("print('Ignore me');")
      .withArgs(sinon.match(/node_script$/)).returns("console.log('Hello, ignore me');")
      .withArgs(sinon.match(/\.jshintignore$/)).returns(path.join("ignore", "**"));

    cli.interpret([
      "node", "jshint", "file.js", "file2.js", "node_script", path.join("ignore", "file1.js"),
      path.join("ignore", "file2.js"), path.join("ignore", "dir", "file1.js")
    ]);

    args = gather.args[0][0];

    test.equal(args.args[0], "file.js");
    test.equal(args.args[1], "file2.js");
    test.equal(args.args[2], "node_script");
    test.equal(args.args[3], path.join("ignore", "file1.js"));
    test.equal(args.args[4], path.join("ignore", "file2.js"));
    test.equal(args.args[5], path.join("ignore", "dir", "file1.js"));
    test.equal(args.ignores, path.resolve(path.join("ignore", "**")));

    fsUtils.readFile.restore();

    fsUtils.isDirectory.withArgs(sinon.match(/src$/)).returns(true)
      .withArgs(sinon.match(/src[\/\\]lib$/)).returns(true);

    this.sinon.stub(fsUtils, "readDirectory")
      .withArgs(sinon.match(/src$/)).returns(["lib", "file4.js"])
      .withArgs(sinon.match(/src[\/\\]lib$/)).returns(["file5.js"]);

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/file2?\.js$/)).returns("console.log('Hello');")
      .withArgs(sinon.match(/file3\.json$/)).returns("{}")
      .withArgs(sinon.match(/src[\/\\]file4\.js$/)).returns("print('Hello');")
      .withArgs(sinon.match(/src[\/\\]lib[\/\\]file5\.js$/)).returns("print('Hello');")
      .withArgs(sinon.match(/\.jshintignore$/)).returns("");

    cli.interpret([
      "node", "jshint", "file.js", "file2.js", "file3.json", "--extra-ext=json", "src"
    ]);

    args = gather.args[1][0];

    test.equal(args.args.length, 4);
    test.equal(args.args[0], "file.js");
    test.equal(args.args[1], "file2.js");
    test.equal(args.args[2], "file3.json");
    test.equal(args.args[3], "src");
    test.equal(args.ignores, false);

    fsUtils.readFile
      .withArgs(sinon.match(/reporter\.js$/)).returns("console.log('Hello');");

    cli.interpret([
      "node", "jshint", "examples"
    ]);

    args = gather.args[2][0];

    test.equal(args.args.length, 1);
    test.equal(args.args[0], "examples");
    test.equal(args.ignores.length, 0);

    test.done();
  },

  testGatherOptionalParameters: function (test) {
    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/file.js$/)).returns(true);

    var files = cli.gather({
      args: ["file.js"]
    });

    test.equal(files.length, 1);
    test.equal(files[0], "file.js");

    test.done();
  },

  testGather: function (test) {
    var dir = __dirname + "/../examples/";
    var files = [];
    this.sinon.stub(process, "cwd").returns(dir);

    var demoFiles = [
      [ /file2?\.js$/, "console.log('Hello');" ],
      [ /ignore[\/\\]file\d\.js$/, "console.log('Hello, ignore me');" ],
      [ /ignore[\/\\]dir[\/\\]file\d\.js$/, "print('Ignore me');" ],
      [ /node_script$/, "console.log('Hello, ignore me');" ]
    ];

    var existsStub = this.sinon.stub(fsUtils, "exists");
    var isDirectoryStub = this.sinon.stub(fsUtils, "isDirectory");
    demoFiles.forEach(function (file) {
      existsStub = existsStub.withArgs(sinon.match(file[0])).returns(true);
    });

    var readFileStub = this.sinon.stub(fsUtils, "readFile");
    demoFiles.forEach(function (file) {
      readFileStub = readFileStub.withArgs(sinon.match(file[0])).returns(file[1]);
    });

    files = cli.gather({
      args: ["file.js", "file2.js", "node_script",
        path.join("ignore", "file1.js"),
        path.join("ignore", "file2.js"),
        path.join("ignore", "dir", "file1.js")
      ],
      ignores: [path.join("ignore", "**")],
      extensions: ""
    });

    test.equal(fsUtils.readFile.args.length, 0);
    test.equal(files.length, 3);
    test.equal(files[0], "file.js");
    test.equal(files[1], "file2.js");
    test.equal(files[2], "node_script");

    demoFiles = [
      [ /file2?\.js$/, "console.log('Hello');" ],
      [ /file3\.json$/, "{}" ],
      [ /src[\/\\]file4\.js$/, "print('Hello');" ],
      [ /src[\/\\]lib[\/\\]file5\.js$/, "print('Hello'); "]
    ];

    demoFiles.forEach(function (file) {
      existsStub = existsStub.withArgs(sinon.match(file[0])).returns(true);
    });

    existsStub = existsStub
      .withArgs(sinon.match(/src$/)).returns(true)
      .withArgs(sinon.match(/src[\/\\]lib$/)).returns(true);

    isDirectoryStub
      .withArgs(sinon.match(/src$/)).returns(true)
      .withArgs(sinon.match(/src[\/\\]lib$/)).returns(true);

    this.sinon.stub(fsUtils, "readDirectory")
      .withArgs(sinon.match(/src$/)).returns(["lib", "file4.js"])
      .withArgs(sinon.match(/src[\/\\]lib$/)).returns(["file5.js"]);

    demoFiles.forEach(function (file) {
      readFileStub = readFileStub.withArgs(sinon.match(file[0])).returns(file[1]);
    });

    cli.interpret([
      "node", "jshint", "file.js", "file2.js", "file3.json", "--extra-ext=json", "src"
    ]);

    files = cli.gather({
      args: ["file.js", "file2.js", "file3.json", "src"],
      extensions: "json",
      ignores: []
    });

    test.equal(fsUtils.readFile.args.length, 5);
    test.equal(files.length, 5);
    test.equal(files[0], "file.js");
    test.equal(files[1], "file2.js");
    test.equal(files[2], "file3.json");
    test.equal(files[3], path.join("src", "lib", "file5.js"));
    test.equal(files[4], path.join("src", "file4.js"));

    fsUtils.exists.restore();
    fsUtils.isDirectory.restore();
    fsUtils.readDirectory.restore();
    fsUtils.readFile.restore();
    process.cwd.restore();

    this.sinon.stub(process, "cwd").returns(__dirname + "/../");
    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/reporter\.js$/)).returns("console.log('Hello');");

    files = cli.gather({
      args: ["examples"],
      extensions: "json",
      ignores: []
    });

    test.equal(fsUtils.readFile.args.length, 0);
    test.equal(files.length, 1);
    test.equal(files[0], path.join("examples", "reporter.js"));

    test.done();
  },

  testStatusCode: function (test) {
    var rep = require("../examples/reporter.js");
    var dir = __dirname + "/../examples/";
    this.sinon.stub(rep, "reporter");
    this.sinon.stub(process, "cwd").returns(dir);

    this.sinon.stub(fsUtils, "exists")
      .withArgs(sinon.match(/(pass\.js|fail\.js)$/)).returns(true);

    this.sinon.stub(fsUtils, "readFile")
      .withArgs(sinon.match(/pass\.js$/)).returns("function test() { return 0; }")
      .withArgs(sinon.match(/fail\.js$/)).returns("console.log('Hello')");

    cli.interpret([
      "node", "jshint", "pass.js", "--reporter=reporter.js"
    ]);

    cli.interpret([
      "node", "jshint", "fail.js", "--reporter=reporter.js"
    ]);

    test.strictEqual(cli.exit.args[0][0], 0);
    test.equal(cli.exit.args[1][0], 2);

    test.done();
  }
};

