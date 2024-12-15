import { useState, useEffect } from "react";
import axios from "axios";

export default function TikTok() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [videos, setVideos] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("tiktokAccessToken");
        const id = localStorage.getItem("tiktokOpenId");
        if (token && id) {
            setAccessToken(token);
            setOpenId(id);
            setIsAuthenticated(true);
        }
    }, []);

    // Function to authenticate with TikTok
    const authenticateWithTikTok = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/v1/tiktok"); 
            window.location.href = response.data.url;
        } catch (error) {
            console.log("Error during authentication:", error);
            console.error("Error during authentication:", error);
        }
    };

    // Function to handle OAuth callback
    const handleOAuthCallback = async (code) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/v1/tiktok/callback?code=${code}`);
            const { access_token, open_id } = response.data;
            localStorage.setItem("tiktokAccessToken", access_token);
            localStorage.setItem("tiktokOpenId", open_id);
            setAccessToken(access_token);
            setOpenId(open_id);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error in OAuth callback:", error);
        }
    };

    // Function to upload video
    const handleVideoUpload = async () => {
        if (!accessToken || !videoFile) {
            alert("Please authenticate and select a video to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('videoFile', videoFile);

        try {
            const response = await axios.post(
                "http://localhost:5000/upload/video",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            alert("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    // Function to fetch videos from TikTok
    const fetchVideos = async () => {
        if (!accessToken || !openId) {
            alert("Please authenticate to fetch videos.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/videos`, {
                params: { accessToken, openId }
            });
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    return (
        <div>
            <h1>TikTok Integration</h1>

            {!isAuthenticated ? (
                <button onClick={authenticateWithTikTok}>Authenticate with TikTok</button>
            ) : (
                <div>
                    <input
                        type="file"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                    <button onClick={handleVideoUpload}>Upload Video</button>

                    <h2>Your TikTok Videos</h2>
                    <button onClick={fetchVideos}>Fetch Videos</button>
                    <ul>
                        {videos.map((video) => (
                            <li key={video.id}>{video.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}; 
