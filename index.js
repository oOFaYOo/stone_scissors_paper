const readline = require('node:readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const _ = require('lodash');
const crypto = require("crypto");

class Moves {
    static movesComparer(comp, user, ...args) {
        const middle = Math.trunc(args.length / 2);
        const distance = comp - user;

        if (comp === user) return 0; //"Draw"

        if (distance < 0 && -1 * distance > middle || distance > 0 && distance <= middle) {
            return -1 //"Lose"
        } else {
            return 1 //"Win"
        }
    }
}

class KeysService {
    static getKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    static getHmac(move, key) {
        return crypto.createHmac('sha256', key).update(move).digest("hex");
    }
}

class Table {
    static _values = {
        '-1': 'Lose',
        '0': 'Draw',
        '1': 'Win'
    }

    static _getTableData(args) {
        const comparedMoves = {};

        for (let i = 0; i < args.length; i++) {
            comparedMoves[args[i]] = {}
            for (let k = 0; k < args.length; k++) {
                comparedMoves[args[i]][[args[k]]] = Table._values[Moves.movesComparer(i, k, ...args)];
            }
        }
        return comparedMoves;
    }

    static getTable(...args) {
        console.table(this._getTableData(args))
    }

}

class Manager {
    static values = {
        '-1': "You lose. Let's try again!",
        '0': 'Draw',
        '1': 'You win!',
        err: 'Error. Make sure you pass an odd number of unique arguments and that the number is greater than or equal to three. Example: rock, scissors, paper.'
    }

    static getAvailableMoves(moves) {
        moves.forEach((v, i) => {
            console.log(`${i + 1} - ${v}`)
        })
        console.log('0 - exit')
        console.log('? - help')
    }

    static _chooseComputerAnswer(max) {
        const rand = Math.random() * (max + 1);
        return Math.floor(rand)
    }

    static play(...args) {
        const moves = args.slice(2);
        if (args.length >= 3 && (args.length % 2) !== 0 && _.uniq(args).length === args.length) {
            const compAnswer = Manager._chooseComputerAnswer(moves.length - 1);
            const key = KeysService.getKey();
            console.log(`HMAC: ${KeysService.getHmac(moves[compAnswer], key)}`);
            console.log('Available moves:');
            Manager.getAvailableMoves(moves);
            process.stdout.write('Enter your move: ');
            rl.on('line', (input) => {
                if (input === '?') {
                    Table.getTable(...moves);
                    process.stdout.write('Enter your move: ');
                } else if (input === '0') {
                    rl.close();
                } else {
                    console.log('Your move: ' + moves[input - 1]);
                    console.log('Computer move: ' + moves[compAnswer]);
                    console.log(Manager.values[Moves.movesComparer(compAnswer, input - 1, moves)]);
                    console.log('HMAC key: ' + key);
                    rl.close();
                }
            });
        } else {
            console.error(Manager.values.err);
            rl.close();
        }
    }
}

Manager.play(...process.argv)