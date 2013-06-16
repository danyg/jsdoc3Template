var sT = Date.now(),
	TAFFY = require('taffydb').taffy,
	fs = require('fs'),
	db = {
		zips: TAFFY(),
		other: TAFFY()
	}
;

var json = JSON.parse( fs.readFileSync('./zips.json') );
db.zips.insert(json);

var tT = Date.now();
console.log('Read and Insertion Time', tT - sT, 'ms' );

console.log( 'Total Records inserted: ' + db.zips().count() );

//var out = db.zips({"pop": {lte: 3000, gt: 300}}).get()
var out = db.zips({"pop": {gt: 100000}}).get()
console.log(out);
console.log('Search time ', out.length, ' results in: ', Date.now() - tT, 'ms' );

console.log( 'Total Records zip: ' + db.zips().count() );
console.log( 'Total Records other: ' + db.other().count() );

console.log( db.other({name:'pepe', kind: 'jose'}).get() );
