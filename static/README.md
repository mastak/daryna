### PREPARE ###

If you using Ubuntu 13.04 or older, add PPA repository with modern Node.js:

	# sudo add-apt-repository ppa:chris-lea/node.js
	# sudo apt-get update

Install Node.js:

	# sudo apt-get install nodejs

If you using Ubuntu 13.10 or newer, install NPM:

	# sudo apt-get install npm

Now you can install Grunt:

	# sudo npm install --global grunt-cli

### BUILD ###

Minimal build (for Back-End developers):

	# grunt

Lint files + minimal build + watch changes on the fly (for Front-End developers):

	# grunt development

Advanced build (for production release):

	# grunt production --hostname cdn.checkio.org

### MANAGE ###

Remove temporary build files:

	# grunt clean

Update build dependencies:

	# rm --recursive node_modules/ && npm install --force --no-bin-links
