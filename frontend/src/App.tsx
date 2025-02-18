import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost/api";

const App: React.FC = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [shortUrls, setShortUrls] = useState<{ shortUrl: string, originalUrl: string }[]>([]);
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        const savedUrls = JSON.parse(localStorage.getItem("shortUrls") || "[]");
        setShortUrls(savedUrls);
    }, []);

    const saveToLocalStorage = (urls: { shortUrl: string, originalUrl: string }[]) => {
        localStorage.setItem("shortUrls", JSON.stringify(urls));
    };

    const handleShorten = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/shorten`, {
                originalUrl,
                alias: alias,
                expiresAt: expiresAt ? Number(expiresAt) : undefined,
            });
            const newShortUrl = response.data.shortUrl;
            const updatedUrls = [...shortUrls, { shortUrl: newShortUrl, originalUrl }];
            setShortUrls(updatedUrls);
            saveToLocalStorage(updatedUrls);
        } catch (error) {
            console.error("Error creating short URL", error);
        }
    };

    const fetchInfo = async (shortUrl: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/info/${shortUrl}`);
            setInfo(response.data);
        } catch (error) {
            console.error("Error fetching URL info", error);
        }
    };

    const deleteUrl = async (shortUrl: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${shortUrl}`);
            const updatedUrls = shortUrls.filter(url => url.shortUrl !== shortUrl);
            setShortUrls(updatedUrls);
            saveToLocalStorage(updatedUrls);
            setInfo(null);
        } catch (error) {
            console.error("Error deleting URL", error);
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <h1 className="title">URL Shortener</h1>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter original URL"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Custom alias (optional)"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <input
                    type="number"
                    className="input-field"
                    placeholder="Expires at (timestamp, optional)"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                />
                <button className="button primary" onClick={handleShorten}>
                    Shorten URL
                </button>
                {shortUrls.length > 0 && (
                    <div className="short-urls-list">
                        <h2>Saved Short URLs</h2>
                        <ul>
                            {shortUrls.map(({ shortUrl, originalUrl }) => (
                                <li key={shortUrl} className={'linkWrapper'}>
                                    <p><strong>Original URL:</strong> {originalUrl}</p>
                                    <a href={`${API_BASE_URL}/${shortUrl}`} target="_blank" rel="noopener noreferrer">{`${API_BASE_URL}/${shortUrl}`}</a>
                                    <button className="button secondary" onClick={() => fetchInfo(shortUrl)}>Get Info</button>
                                    <button className="button danger" onClick={() => deleteUrl(shortUrl)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {info && (
                    <div className="info-box">
                        <h2 className="info-title">URL Info</h2>
                        <p><strong>Original URL:</strong> {info.originalUrl}</p>
                        <p><strong>Created At:</strong> {new Date(info.createdAt).toLocaleString()}</p>
                        <p><strong>Click Count:</strong> {info.clickCount}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
