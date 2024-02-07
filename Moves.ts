import {IMoves, Result} from "./types";

class Moves implements IMoves {
     movesComparer(comp, user, args) {
        const middle = Math.trunc(args.length / 2);
        const distance = comp - user;

        if (comp === user)
            return Result.Draw;

        if (distance < 0 && -1 * distance > middle || distance > 0 && distance <= middle) {
            return Result.Win;
        } else {
            return Result.Lose;
        }
    }
}

export default new Moves();

