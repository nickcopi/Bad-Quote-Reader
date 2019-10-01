const request = require('request-promise');
const cheerio = require('cheerio');
const readline = require('readline');
const fs = require('fs');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);



let getPage = async ()=>{
	return await request('http://bash.org/?random');
}

let display = ()=>{
	console.log('\033[2J');
	console.log(entries[place]);
}

const entries = [];
let place = 0;
let init = async ()=>{
	const $ = cheerio.load(await getPage());
	$('.qt').each(function(i,e){
		entries.push($(this).text());
	});
	display();
}
init();


let saveFile = ()=>{
	let data = openFile();
	data.push(entries[place]);
	fs.writeFileSync('saved.json',JSON.stringify(data));
}
let openFile = ()=>{
	try{
		return JSON.parse(fs.readFileSync('saved.json').toString('utf8'));
	} catch (e){
		return [];
	}
}

process.stdin.on('keypress',(str,key)=>{
	if (key.ctrl && key.name === 'c' || key.name === 'q') {
	   process.exit();
	 } else {
		 if(str === 'd'){
			place = (place % entries.length) + 1
			 display();
		 }
		 if(str === 'a'){
			place = (place % entries.length) - 1
			 display();
		 }
		 if(str === 's'){
			 saveFile();
		 }
	 }
	
});
