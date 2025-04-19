import dotenv from 'dotenv';
dotenv.config(); 
import asyncHandler from 'express-async-handler'; 

const TIKTOK_CLIENT_ID = process.env.TIKTOK_CLIENT_ID;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;


const getOAuth = asyncHandler(async (req, res) => {
    const oauthUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${TIKTOK_CLIENT_ID}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${TIKTOK_REDIRECT_URI}`;
    res.json({ url: oauthUrl });
}); 

const getOAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query; // OAuth code received from TikTok
    try {
        const response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
            client_key: TIKTOK_CLIENT_ID,
            client_secret: TIKTOK_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: TIKTOK_REDIRECT_URI
        });
        const { access_token, open_id } = response.data;

        // Save the access token (in session, DB, or some secure place)
        res.json({ access_token, open_id }); // In real-world, you may store the token in session or DB
    } catch (error) {
        console.error("Error during TikTok OAuth:", error);
        res.status(500).send("Error during OAuth process");
    }
}); 

const getVideos = asyncHandler(async (req, res) => {
    const { accessToken, openId } = req.query;

    if (!accessToken || !openId) {
        return res.status(400).send("Missing access token or openId.");
    }

    try {
        const response = await axios.get(
            `https://open-api.tiktok.com/video/list/`,
            {
                params: {
                    access_token: accessToken,
                    open_id: openId,
                    count: 10, // Adjust the count for the number of videos to fetch
                }
            }
        );

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).send("Error fetching videos");
    }
}); 

const createVideo = asyncHandler(async (req, res) => {
    const { videoFile, accessToken } = req.body;

    if (!videoFile || !accessToken) {
        return res.status(400).send("Missing video or access token.");
    }

    try {
        const formData = new FormData();
        formData.append('video', videoFile); // Video file to upload

        // Upload video request
        const response = await axios.post(
            'https://open-api.tiktok.com/video/upload/',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        res.json({ message: 'Video uploaded successfully', videoId: response.data.video_id });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).send("Error uploading video");
    }
}); 


export { getOAuth, 
        getOAuthCallback, 
        getVideos, 
        createVideo }; 