export const PlayerCardImgSrc = function(hash) {
    return "//nba-live-mobile-parser-api.herokuapp.com/searchCardImage/?hash=" + hash;
};

export const PlayerProfileUrl = function(hash) {
    return "/#/card-profile?player_id=" + hash;
};

export const convertInchesToHeightString = function(inches) {
    const feet = Math.floor(inches/12);
    const inch = inches % 12;
    return `${feet}'${inch}"`;
}
