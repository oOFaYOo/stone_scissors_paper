import Moves from "./Moves";
import {ITable} from "../types";

class Table implements ITable {
    private getTableData(args: readonly string []): { [key: string]: { [key: string]: string } } {
        const comparedMoves = {};

        for (let i = 0; i < args.length; i++) {
            comparedMoves[args[i]] = {}
            for (let k = 0; k < args.length; k++) {
                comparedMoves[args[i]][[args[k]]] = Moves.movesComparer(i, k, args).toString();
            }
        }
        return comparedMoves;
    }

    getTable(args) {
        console.log('PC ↓   ' + 'User →   ' + '   The table results are for user answers');
        console.table(this.getTableData(args));
    }

}

export default new Table();