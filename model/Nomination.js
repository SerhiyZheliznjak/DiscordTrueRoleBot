class Nomination {
    constructor(name, condition, msg) {
        this._name = name;
        this._condition = condition;
        this._msg = msg;
        this._points = [];
    }
    getName() {
        return this._name
    };
    getCondition() {
        return this._condition;
    }
    scoreMatch(match, player_slot) {
        this.addPoints(this._condition(match, player_slot));
    }
    addPoints(val) {
        this._points.push(val);
    }
    getScore() {
        return this._points.reduce((r, p) => {
            return p != null ? r + p : r;
        }, 0);
    }
    getMessage() {
        return this._msg;
    }
    isCorrupted() {
        return this._points.every(point => point === null);
    }
}

module.exports = Nomination;