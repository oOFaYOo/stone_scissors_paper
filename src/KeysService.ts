const crypt = require("crypto");
import {IKeysService} from "../types";

class KeysService implements IKeysService {
    getKey() {
        return crypt.randomBytes(32).toString('hex');
    }

    getHmac(move, key) {
        return crypt.createHmac('sha256', key).update(move).digest("hex");
    }

}

export default new KeysService();