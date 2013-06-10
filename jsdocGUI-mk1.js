var constants = require('jsdocGUILink/constants'),
	path = require('path'),
	fs = require('fs')
;

function make(INPUT_DIR){

	var child_process = require('child_process'),
		jsdoc,
		command = constants.jsdocExec + ' -X -p -l -r ' + INPUT_DIR
	;

	console.log('cmd: ' + command);
	console.log('');
	console.log('');

	jsdoc = child_process.exec(
		command,
		{
			maxBuffer: 2000000,
			encoding: 'utf-8'
		},
		function(error, stdout, stderr){
			var data = stdout.toString().split('\u0000\u0000'),
				toReturn = {
					warnings: '',
					data: {}
				}
			;

			if(data[1]){
				toReturn.warnings = data[0];
				toReturn.doclets = JSON.parse(data[1]);
			}else{
				toReturn.doclets = JSON.parse(data[0]);
			}
			
			
			console.log(toReturn.warnings);
			console.log('Doclet Founded: ' + toReturn.doclets.length + ' founded');
		}
	);
	jsdoc.on('error', function(){
		console.log('error');
		console.log(arguments);
	});
	jsdoc.on('message', function(){
		console.log('message');
		console.log(arguments);
	});
	jsdoc.on('exit', function(){
		
		
//		fs.readFile('file.log', function(err, buffer){
//			var data = JSON.parse(buffer.toString());
//			
//			console.log(data.length);
//		});
		
		console.log('exit');
		console.log(arguments);
		console.log('');
		console.log('I\'m Done!');

	});

};

console.log('Initializing JsDOC GUI MK1...');
make(path.resolve(process.cwd() + '/../jsdoc3_test_code/src'));