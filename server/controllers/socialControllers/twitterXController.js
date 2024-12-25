import dotenv from 'dotenv';
dotenv.config(); 
import asyncHandler from "express-async-handler"; 
import { TwitterApi } from 'twitter-api-v2'; 


const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY, 
    appSecret: process.env.TWITTER_API_SECRET_KEY, 
    accessToken: process.env.TWITTER_ACCESS_TOKEN, 
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}); 


const tweet = asyncHandler(async (req, res) => {
    try {
        const { message } = req?.body; 
        const tweet = await twitterClient.v2.tweet(message); 
        res.status(201).json({ data: tweet }); 
    } catch (error) {
        // res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        res.status(400).json({ message: `${error}`, details: `${error}` }); 
    }
}); 


export { tweet };