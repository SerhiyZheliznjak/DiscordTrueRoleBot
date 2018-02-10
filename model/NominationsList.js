const MaxDamageHit = require('./nominations/MaxDamageHit');
const Blade = require('./nominations/Blade');
const Donor = require('./nominations/Donor');
const JungleOppressor = require('./nominations/JungleOppressor');
const RapunzelSyndrome = require('./nominations/RapunzelSyndrome');

function getAllNominations() {
    return [
        MaxDamageHit.create(),
        Blade.create(),
        Donor.create(),
        JungleOppressor.create(),
        RapunzelSyndrome.create(),
    ];
}

module.exports = {
    create: getAllNominations
};
