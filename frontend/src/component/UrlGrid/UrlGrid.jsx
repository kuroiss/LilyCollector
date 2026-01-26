import React, { useState } from 'react';
import './UrlGrid.css';
import { URL_DATA } from '../common/UrlData';


const UrlGridApp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3列 × 3行 = 9枚

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = URL_DATA.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(URL_DATA.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="url-app-container">
      <h1 className="url-app-title">URL Gallery (3x3)</h1>
      
      <div className="url-grid">
        {currentItems.map((item) => (
          <a 
            key={item.id} 
            href={item.url} 
            className="url-card"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <div className="url-info-title">{item.title}</div>
            <div className="url-info-link">{item.url}</div>
          </a>
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