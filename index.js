const _ = require('lodash');
const crypto = require("crypto");

function io(p,c, ...args){
    let win = Math.trunc(args.length/2);

    if(p === c) return 'Draw'

    let d = p - c;

    if(d < 0 && -1 * d > win || d > 0 && d <= win){
        return 'Lose'
    } else {
        return "Win"
    }
}


function uuu (p, c, ...args){
    if(args.length >= 3 && (args.length % 2) !== 0 && _.uniq(args).length === args.length){

        let obj = {};
        args.forEach((v,i)=>{obj[v]=i});
        let win = Math.trunc(args.length/2);

        if(obj[c] === obj[args[p-1]]) return 'Draw'

        let val = obj[c] + win;

        if(obj[args[p-1]] > val || obj[args[p-1]] < val%args.length){
            return 'You win!'
        } else {
            return "You lose. Let's try again!"
        }

    } else {
        return 'Error. Make sure you pass an odd number of unique arguments ' +
            'and that the number is greater than or equal to three. ' +
            'Example: rock, paper, scissors.'
    }
}


function getKey(str){
    let buf = crypto.randomBytes(32).toString('hex');
    return  crypto.createHmac('sha256', buf).update(str).digest("hex");
}

console.log(uuu('a','e', 'a','b','c','d','e'))

function getTable (...args){

    let rt = {};

    for(let i = 0; i < args.length; i++){
        rt[args[i]] = {}
        for(let k = 0; k < args.length; k++){
            rt[args[i]][[args[k]]] = io(i, k, ...args);
        }
    }
    return rt;
}

console.table(getTable('a','b','c','d','e'))
