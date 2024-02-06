const readline = require('node:readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const _ = require('lodash');
const crypt = require("crypto");

class Moves {
    static movesComparer(comp: number, user: number, args: readonly string[]): number {
        const middle = Math.trunc(args.length / 2);
        const distance = comp - user;

        if (comp === user) return 0; //"Draw"

        if (distance < 0 && -1 * distance > middle || distance > 0 && distance <= middle) {
            return 1 //"Win"
        } else {
            return -1 //"Lose"
        }
    }
}

class KeysService {
    static getKey(): string {
        return crypt.randomBytes(32).toString('hex');
    }

    static getHmac(move: string, key: string): string {
        return crypt.createHmac('sha256', key).update(move).digest("hex");
    }

}

class Table {
    private static values = {
        '-1': 'Lose',
        '0': 'Draw',
        '1': 'Win'
    }

    private static getTableData(args: readonly string []): { [key: string]: { [key: string]: string } } {
        const comparedMoves = {};

        for (let i = 0; i < args.length; i++) {
            comparedMoves[args[i]] = {}
            for (let k = 0; k < args.length; k++) {
                comparedMoves[args[i]][[args[k]]] = Table.values[Moves.movesComparer(i, k, args)];
            }
        }
        return comparedMoves;
    }

    static getTable(args: readonly string[]): void {
        console.log('PC ↓   ' + 'User →   ' + '   The table results are for user answers');
        console.table(this.getTableData(args));
    }

}

class Manager {
    private static values = {
        '-1': "You lose. Let's try again!",
        '0': 'Draw',
        '1': 'You win!',
        err: 'Error. Make sure you pass:\n' +
            '- an odd number of unique arguments;\n' +
            '- amount of arguments is greater than or equal to three;\n' +
            '- you use English letters or numbers;\n' +
            'Example: rock, scissors, paper'
    }

    private static getAvailableMoves(moves: readonly string[]): void {
        moves.forEach((v, i) => {
            console.log(`${i + 1} - ${v}`)
        })
        console.log('0 - exit')
        console.log('? - help')
    }

    private static chooseComputerAnswer(max: number): number {
        const rand = Math.random() * (max + 1);
        return Math.floor(rand)
    }

    static play(args: readonly string[]): void {
        const moves = args.slice(2);
        if (!(/[а-яА-Я]/.test(args.join())) && args.length >= 3 && (args.length % 2) !== 0 && _.uniq(args).length === args.length) {
            const compAnswer = Manager.chooseComputerAnswer(moves.length - 1);
            const key = KeysService.getKey();
            console.log(`HMAC: ${KeysService.getHmac(moves[compAnswer], key)}`);
            console.log('Available moves:');
            Manager.getAvailableMoves(moves);
            process.stdout.write('Enter your move: ');
            rl.on('line', (input) => {
                if (input === '?') {
                    Table.getTable(moves);
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

Manager.play(process.argv)