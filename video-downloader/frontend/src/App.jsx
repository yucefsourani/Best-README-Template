import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getInfo = async () => {
    if (!url) {
      setError('Please enter a video URL');
      return;
    }
    setLoading(true);
    setError('');
    setVideoInfo(null);
    try {
      const response = await fetch(`http://localhost:8000/api/info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }
      const data = await response.json();
      setVideoInfo(data);
      if (data.formats.length > 0) {
        setSelectedFormat(data.formats[0].format_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!url || !selectedFormat) {
      setError('Please get video info and select a format first.');
      return;
    }
    try {
        const response = await fetch(`http://localhost:8000/api/download?url=${encodeURIComponent(url)}&format_id=${selectedFormat}`);
        if (!response.ok) {
            throw new Error('Failed to get download link');
        }
        const data = await response.json();
        window.open(data.url, '_blank');
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Downloader</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={getInfo} disabled={loading}>
            {loading ? 'Loading...' : 'Get Info'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {videoInfo && (
          <div className="video-info">
            <h2>{videoInfo.title}</h2>
            <img src={videoInfo.thumbnail} alt={videoInfo.title} />
            <div className="download-container">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {videoInfo.formats.map((format) => (
                  <option key={format.format_id} value={format.format_id}>
                    {format.resolution} - {format.ext} ({format.note})
                  </option>
                ))}
              </select>
              <button onClick={downloadVideo}>Download</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
