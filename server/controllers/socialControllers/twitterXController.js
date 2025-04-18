import dotenv from 'dotenv';
dotenv.config(); 
import asyncHandler from "express-async-handler"; 
import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js';
import { TwitterApi } from 'twitter-api-v2'; 
import { unlinkSync } from 'fs';
import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { createInterface } from 'readline';
import { stringify } from 'querystring';
import SocialPost from '../../models/SocialPost.js';


const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY, 
    appSecret: process.env.TWITTER_API_SECRET_KEY, 
    accessToken: process.env.TWITTER_ACCESS_TOKEN, 
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}); 


const tweet = asyncHandler(async (req, res) => {
    try {
        // const { message } = req?.body; 
        // const tweet = await twitterClient.v2.tweet(message); 
        // res.status(201).json({ data: tweet }); 

        // const got = require('got');
        // const crypto = require('crypto');
        // const OAuth = require('oauth-1.0a');
        // const qs = require('querystring');

        // const readline = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // }); 

        const readline = createInterface({
            input: process.stdin,
            output: process.stdout
        });


        // The code below sets the consumer key and consumer secret from your environment variables
        // To set environment variables on macOS or Linux, run the export commands below from the terminal:
        // export CONSUMER_KEY='YOUR-KEY'
        // export CONSUMER_SECRET='YOUR-SECRET'
        const consumer_key = process.env.CONSUMER_KEY;
        const consumer_secret = process.env.CONSUMER_SECRET;


        // Be sure to add replace the text of the with the text you wish to Tweet.
        // You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
        const data = {
        "text": "Hello world!"
        };

        const endpointURL = `https://api.twitter.com/2/tweets`;

        // this example uses PIN-based OAuth to authorize the user
        const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
        const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
        const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
        const oauth = OAuth({
        consumer: {
            key: consumer_key,
            secret: consumer_secret
        },
        signature_method: 'HMAC-SHA1',
        hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
        });

        async function input(prompt) {
        return new Promise(async (resolve, reject) => {
            readline.question(prompt, (out) => {
            readline.close();
            resolve(out);
            });
        });
        }

        async function requestToken() {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: requestTokenURL,
            method: 'POST'
        }));

        const req = await got.post(requestTokenURL, {
            headers: {
            Authorization: authHeader["Authorization"]
            }
        });
        if (req.body) {
            return qs.parse(req.body);
        } else {
            throw new Error('Cannot get an OAuth request token');
        }
        }


        async function accessToken({
        oauth_token,
        oauth_token_secret
        }, verifier) {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: accessTokenURL,
            method: 'POST'
        }));
        const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
        const req = await got.post(path, {
            headers: {
            Authorization: authHeader["Authorization"]
            }
        });
        if (req.body) {
            return qs.parse(req.body);
        } else {
            throw new Error('Cannot get an OAuth request token');
        }
        }


        async function getRequest({
        oauth_token,
        oauth_token_secret
        }) {

        const token = {
            key: oauth_token,
            secret: oauth_token_secret
        };

        const authHeader = oauth.toHeader(oauth.authorize({
            url: endpointURL,
            method: 'POST'
        }, token));

        const req = await got.post(endpointURL, {
            json: data,
            responseType: 'json',
            headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
            }
        });
        if (req.body) {
            return req.body;
        } else {
            throw new Error('Unsuccessful request');
        }
        }


        (async () => {
        try {
            // Get request token
            const oAuthRequestToken = await requestToken();
            // Get authorization
            authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
            console.log('Please go here and authorize:', authorizeURL.href);
            const pin = await input('Paste the PIN here: ');
            // Get the access token
            const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
            // Make the request
            const response = await getRequest(oAuthAccessToken);
            console.dir(response, {
            depth: null
            });
        } catch (e) {
            console.log(e);
            process.exit(-1);
        }
        process.exit();
        })();

    } catch (error) {
        // res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        res.status(400).json({ message: `${error}`, details: `${error}` }); 
    }
}); 


const postTweet = asyncHandler(async (req, res) => {
    try {
        const { message } = req?.body;

        const allMedia = [
            req?.files?.media_1, 
            req?.files?.media_2, 
            req?.files?.media_3,
        ]; 

        // console.log(allMedia)
        // console.log(req?.body)
        // console.log(req?.files)

        const validMedia = allMedia.filter(media => media != null); 

        console.log(validMedia)

        let mediaArray = [];
        let mediaIds = [];

        if (validMedia?.length > 0) {
            for (let i = 0; i < validMedia.length; i++) {
                const media = validMedia[i]; 
                // console.log(media)

                let tweetMediaUpload = await cloudinaryImageUpload(media.tempFilePath, "deezysdeals_tweet_media"); 
                if (!tweetMediaUpload) return res.status(400).json({ message: "Media upload failed" }); 

                mediaArray.push(tweetMediaUpload.secure_url); 

                let mediaId;

                // const mimeType = media.match(/^data:(.+);base64,/)[1];

                // const isVideo = mimeType.startsWith('video/');
                const isVideo = media.mimetype.startsWith('video/');
                // const isImage = mimeType.startsWith('image/');
                const isImage = media.mimetype.startsWith('image/');

                if (isImage) {
                    // Simple upload for images
                    console.log(media)
                    mediaId = await twitterClient.v1.uploadMedia(media.tempFilePath, {
                        mimeType: media.mimetype,
                    });
                } else if (isVideo) {
                    // Chunked upload for videos
                    console.log(media)
                    mediaId = await twitterClient.v1.uploadMedia(media.tempFilePath, {
                        mimeType: media.mimetype,
                        target: 'tweet_video',
                    });
                } else {
                    throw new Error(`Unsupported media type: ${media.mimetype}`);
                }

                mediaIds.push(mediaId);

                // Clean up uploaded file
                // fs.unlinkSync(media.tempFilePath);
            }
        }

        const tweet = await twitterClient.v2.tweet({
            text: message,
            media: mediaIds.length ? { media_ids: mediaIds } : undefined,
        });

        const addTweetToDatabase = await SocialPost.create({
            user: req?.user_id,
            message: message,
            media: mediaArray,
            network: 'twitter-x',
        });

        // const addTweetToDatabase = new SocialPost({
        //     user: req?.user_id,
        //     message: message,
        //     media: validMedia,
        //     network: 'twitter-x',
        // });

        // addTweetToDatabase.save()
        //                 .then(() => {
        //                     res.status(201).json({ success: `Tweet added`, data: addTweetToDatabase });
        //                 })
        //                 .catch((error) => {
        //                     if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        //                 });

        res.status(201).json({ success: `Tweet added`, data: addTweetToDatabase });
    } catch (error) {
        res.status(400).json({ message: "An error occured!", details: `${error}` }); 
    }
});


export { tweet, postTweet };