import axios from "axios";
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};
function formatMusicItem(it) {
    return {
        platform: '881903',
        id: it.song_id,
        artist: it.singer_name,
        title: it.song_name,
        url: it.audio_url,
        duration: 30,
    };
}
async function getMediaSource(musicItem, quality) {
    return {
        url: musicItem.url,
    };
}
async function getTopLists() {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const weeksInYear = Math.ceil(((currentDate - startOfYear) / (1000 * 60 * 60 * 24) + startOfYear.getDay() + 1) / 7);

    let topLists = [];

    for (let week = 1; week < weeksInYear; week++) {
        topLists.push({
            title: `第${week}周排行榜`,
            data: [
                {
                    id: "songSpecialityDetails",
                    type: "playlist",
                    week: week,
                    title: "903專業推介",
                },
                {
                    id: "songGapDetails",
                    type: "playlist",
                    week: week,
                    title: "903豁達推介",
                },
            ],
        });
    }
    topLists.reverse();
    return topLists;
}
async function getTopListDetail(topListItem) {
    const resp = (await axios.get(`https://www.881903.com/api/chart/songdetails?year=2024&week=${topListItem.week}`, {
        headers,
    })).data.response;
    if (topListItem.id === "songSpecialityDetails") {
        return {
            isEnd: true,
            musicList: resp.songSpecialityDetails.map(formatMusicItem),
        };
    } else {
        return {
            isEnd: true,
            musicList: resp.songGapDetails.map(formatMusicItem),
        };
    }

}

module.exports = {
    platform: "商业电台排行榜",
    author: "imYip",
    version: "0.0.1",
    supportedSearchType: ["music"],
    srcUrl: "https://fastly.jsdelivr.net/gh/imyip/MusicFreePlugin-881903@master/dist/plugin.js",
    cacheControl: "no-cache",
    getMediaSource,
    getTopListDetail,
    getTopLists,
};
