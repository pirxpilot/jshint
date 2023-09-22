NODE_BIN=node_modules/.bin

check: lint test

browser-test-server:
	node tests/helpers/browser/server

build:
	node bin/build

data:
	node scripts/generate-identifier-data

fetch-test262:
	git submodule init
	git submodule update

lint:
	node ./bin/jshint src
	$(NODE_BIN)/jscs src

test-all: test test-262

test-262:
	node tests/test262

test-cli:
	$(NODE_BIN)/nodeunit tests/cli.js

test: test-unit test-cli test-regression

test-regression:
	$(NODE_BIN)/nodeunit tests/regression

test-unit:
	$(NODE_BIN)/nodeunit tests/unit

test-website:
	node tests/website.js


.PHONY: browser-test-server build check data fetch-test262 lint test test-262 test-all test-cli test-regression test-unit test-website
