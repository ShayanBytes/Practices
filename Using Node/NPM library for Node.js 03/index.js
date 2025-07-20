// installed sillyname package from npm in dash git commandline

import generateName from "sillyname";


// var generateName = require('sillyname');
var sillyName = generateName();
console.log(`My name is ${sillyName}.`);



import {randomSuperhero} from 'superheroes'; 
console.log(`My name is ${randomSuperhero()}. `);
