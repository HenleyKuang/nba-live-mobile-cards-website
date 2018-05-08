export const PlayerCardImgSrc = function(hash) {
    return "//nba-live-mobile-parser-api.herokuapp.com/searchCardImage/?hash=" + hash;
};

export const PlayerProfileUrl = function(hash) {
    return "/#/card-profile?player_id=" + hash;
};
