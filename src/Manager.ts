const readline = require('node:readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const _ = require('lodash');

import {IManager, Result} from "./types";
import KeysService from "./KeysService";
import Table from "./Table";
import Moves from "./Moves";

class Manager implements IManager {
    private getResultDescription(result: Result | null):string {
        switch (result)
        {
            case Result.Lose:
                return "You lose. Let's try again!";
            case Result.Draw:
                return "Draw";
            case Result.Win:
                return "You win!"
            case Result.Error:
                return 'Error. Make sure you pass:\n' +
                    '- an odd number of unique arguments;\n' +
                    '- amount of arguments is greater than or equal to three;\n' +
                    '- you use English letters or numbers;\n' +
                    'Example: rock, scissors, paper';
        }
    }

    private getAvailableMoves(moves: readonly string[]): void {
        moves.forEach((v, i) => {
            console.log(`${i + 1} - ${v}`)
        })
        console.log('0 - exit')
        console.log('? - help')
    }

    private chooseComputerAnswer(max: number): number {
        const rand = Math.random() * (max + 1);
        return Math.floor(rand)
    }

    play(args) {
        const moves = args.slice(2);

        if ((/^[a-zA-Z0-9]*$/.test(moves.join(''))) && moves.length >= 3 && (moves.length % 2) !== 0 && _.uniq(moves).length === moves.length) {
            const compAnswer = this.chooseComputerAnswer(moves.length - 1);
            const key = KeysService.getKey();
            console.log(`HMAC: ${KeysService.getHmac(moves[compAnswer], key)}`);
            console.log('Available moves:');
            this.getAvailableMoves(moves);
            process.stdout.write('Enter your move: ');
            rl.on('line', (input) => {
                if (input === '?') {
                    Table.getTable(moves);
                    process.stdout.write('Enter your move: ');
                } else if (input === '0') {
                    rl.close();
                } else if(isNaN(input) || +input > moves.length || +input < 0) {
                    console.warn('Warning.Please enter a value from the available moves.');
                    process.stdout.write('Enter your move: ');
                } else {
                    console.log('Your move: ' + moves[input - 1]);
                    console.log('Computer move: ' + moves[compAnswer]);
                    console.log(this.getResultDescription(Moves.movesComparer(compAnswer, input - 1, moves)));
                    console.log('HMAC key: ' + key);
                    rl.close();
                }
            });
        } else {
            console.error(this.getResultDescription(Result.Error));
            rl.close();
        }
    }
}

export default new Manager();