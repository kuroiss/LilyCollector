const URL_LIST = [
    "https://x.com/shiki_820/status/2014732338283086127?s=20",
    "https://x.com/suzuo_all/status/2014955312202318278?s=12",
    "https://x.com/anime_kimishinu/status/2014669469373870206?s=53",
    "https://www.youtube.com/watch?si=q3e_HY1LMOks7O8f&v=OUeO0rIjZKo&feature=youtu.be",
    "https://x.com/elhongo14/status/2013032820717801824?s=46",
    "https://x.com/zenma_trang/status/2013457533705580578?s=46",
    "https://t.co/3DP0BXoPzj",
    "https://t.co/eGZF4rzrdz",
    "https://x.com/basane158/status/2013386488017203676?s=12",
    "https://x.com/gkmas_official/status/2013159495548191123?s=12",
]

export const URL_DATA = Array.from({length: URL_LIST.length}, (_, i) => ({
    id: i + 1,
    url: URL_LIST[i],
    title: `Contents ${i + 1}`,
}));


