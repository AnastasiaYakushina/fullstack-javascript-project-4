install:
	npm ci

publish:
	npm publish --dry-run

page-loader:
	node bin/page-loader.js

lint:
	npx eslint .	

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8
