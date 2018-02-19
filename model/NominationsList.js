const MaxDamageHit = require('./nominations/MaxDamageHit');
const Blade = require('./nominations/Blade');
const Donor = require('./nominations/Donor');
const JungleOppressor = require('./nominations/JungleOppressor');
const RapunzelSyndrome = require('./nominations/RapunzelSyndrome');
const MotherOfGod = require('./nominations/MotherOfGod');
const OponentOwsMoney = require('./nominations/OponentOwsMoney');
const StackGod = require('./nominations/StackGod');
const Parkinson = require('./nominations/Parkinson');
const BestKDA = require('./nominations/BestKDA');
const WinnerForLife = require('./nominations/WinnerForLife');
const Looser = require('./nominations/Looser');
const Rage = require('./nominations/Rage');

function getAllNominations() {
    return [
        MaxDamageHit.create(),
        Blade.create(),
        Donor.create(),
        JungleOppressor.create(),
        RapunzelSyndrome.create(),
        MotherOfGod.create(),
        OponentOwsMoney.create(),
        StackGod.create(),
        Parkinson.create(),
        BestKDA.create(),
        WinnerForLife.create(),
        Looser.create(),
        Rage.create(),
    ];
}

module.exports = {
    create: getAllNominations
};
