const _ = require('lodash');
const crypto = require("crypto");

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

    static _chooseAnswer(max) {
        const rand = Math.random() * (max + 1 - 0);
        return Math.floor(rand)
    }

    static start(...args) {
        const moves = args.slice(2);
        if (args.length >= 3 && (args.length % 2) !== 0 && _.uniq(args).length === args.length) {
            const compAnswer = moves[Manager._chooseAnswer(moves.length-1)];
            const key = KeysService.getKey();
            console.log(`HMAC: ${KeysService.getHmac(compAnswer, key)}`);
            console.log('Available moves:');
            Manager.getAvailableMoves(moves);
        } else {
            console.log(Manager.values.err)
        }
    }

}

class Moves {
    static movesComparer(user, comp, ...args) {
        const middle = Math.trunc(args.length / 2);
        const distance = user - comp;

        if (user === comp) return 0; //'Draw'

        if (distance < 0 && -1 * distance > middle || distance > 0 && distance <= middle) {
            return -1 //'Lose'
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

// Table.getTable('a','b','c','d','e')

Manager.start(...process.argv)