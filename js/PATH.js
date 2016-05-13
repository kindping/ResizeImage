var PATH = {
	root : 'app/action/',
	ajax : {
		Image : 'Image.php'
	}
};
for(var i in PATH.ajax) {
	PATH.ajax[i] = PATH.root + PATH.ajax[i];
}