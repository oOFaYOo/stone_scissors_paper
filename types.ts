export enum Result {
    Draw = 'Draw',
    Win = 'Win',
    Lose = 'Lose',
    Error = 'Error'
}

export interface ITable {
    getTable: (args: readonly string[]) => void;
}

export interface IMoves {
    movesComparer: (comp: number, user: number, args: readonly string[]) => Result;
}

export interface IKeysService {
    getKey: () => string;
    getHmac: (move: string, key: string) => string;
}

export interface IManager {
    play: (args: readonly string[]) => void;
}