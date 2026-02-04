import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Tweet, EmbeddedTweet, TweetNotFound } from 'react-tweet';
import { getTweet } from 'react-tweet/api';
import './UrlGrid.css';
import getLilyList from '../common/API/GetLilyList';

const UrlGridApp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lilyList, setLilyList] = useState([]);
  const itemsPerPage = 9; // 3列 × 3行 = 9枚

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lilyList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lilyList.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    (async () => {
      const response = await getLilyList();

      setLilyList(() => response);
    })();
  }, []);

  return (
    <div className="url-app-container">
      <h1 className="url-app-title">URL Gallery</h1>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          前へ
        </button>
        <span className="page-indicator">
          {currentPage} / {totalPages}
        </span>

        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次へ
        </button>
      </div>

      <div className="url-grid">
        {currentItems.map((item) => (
          <GridItem item={item}/>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          前へ
        </button>
        <span className="page-indicator">
          {currentPage} / {totalPages}
        </span>

        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default UrlGridApp;

const TWITTER_URL = "https://x.com/";
const YOUTUBE_URL = "https://www.youtube.com/"

const GridItem = ({item}) => {
  const item_url = item.url;

  const extractTweetId = (url) => {
    // status/の後にある 1文字以上の数字(\d+)をパースする
    const match = url.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  }

  // YouTube IDの抽出 (URLパラメータ "v" を取得)
  const extractYouTubeId = (inputUrl) => {
    try {
      const urlObj = new URL(inputUrl);
      // www.youtube.com かつ パラメータ v があるか確認
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        return urlObj.searchParams.get('v');
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // twitterのURLである時
  if(item_url.includes(TWITTER_URL))
  {
    const tweet_id = extractTweetId(item_url);
    return(
      <div
        className="tweet-frame"
        data-theme="dark">
        <Tweet id={tweet_id} />
      </div>
    );
  }
  else if(item.url.includes(YOUTUBE_URL))
  {
    const youtube_id = extractYouTubeId(item_url);
    return (
      <iframe
        className="youtube-frame"
        src={`https://www.youtube.com/embed/${youtube_id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ borderRadius: '12px' }}
      ></iframe>
    );
  }
  else
  {
    return(
      <a
      key={item.id}
      href={item.url}
      className="url-card"
      target="_blank"
      rel="noopener noreferrer">
        <div className="url-info-title">{item.title}</div>
        <div className="url-info-link">{item.url}</div>
      </a>
    );
  }
}
