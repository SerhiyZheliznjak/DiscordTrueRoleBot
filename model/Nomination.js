const Point = require('./Point');

class Nomination {
    constructor(name, condition, minCount, msg) {
        this._name = name;
        this._condition = condition;
        this._msg = msg;
        this._points = [];
        this._minScore = minCount;
    }
    getName() {
        return this._name
    };
    getCondition() {
        return this._condition;
    }
    scoreMatch(match, player_slot) {
        this.addPoints(match.match_id, this._condition(match, player_slot));
    }
    addPoints(match_id, val) {
        this._points.push(new Point(match_id, val));
    }
    getPoints() {
        return this._points;
    }
    getScore() {
        return this._points.reduce((r, p) => {
            return p != null ? r + p.point : r;
        }, 0);
    }
    getMessage() {
        return this._msg;
    }
    isCorrupted() {
        return this._points.every(point => point.point === null);
    }
    getMinScore() {
        return this._minScore;
    }
}

module.exports = Nomination;