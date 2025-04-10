import dotenv from 'dotenv';
dotenv.config(); 
import asyncHandler from "express-async-handler"; 
import { TwitterApi } from 'twitter-api-v2'; 
import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { createInterface } from 'readline';
import { stringify } from 'querystring';


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
        const tweet = await twitterClient.v2.tweet(message); 
        res.status(201).json({ data: tweet }); 
        // const files = req.files;

        // let mediaIds = [];

        // if (files && files.length > 0) {
        //     for (const file of files) {
        //         let mediaId;

        //         // Determine if the file is an image or a video
        //         const isVideo = file.mimetype.startsWith('video/');
        //         const isImage = file.mimetype.startsWith('image/');

        //         if (isImage) {
        //             // Simple upload for images
        //             mediaId = await twitterClient.v1.uploadMedia(file.path, {
        //                 mimeType: file.mimetype,
        //             });
        //         } else if (isVideo) {
        //             // Chunked upload for videos
        //             mediaId = await twitterClient.v1.uploadMedia(file.path, {
        //                 mimeType: file.mimetype,
        //                 target: 'tweet_video',
        //             });
        //         } else {
        //             throw new Error(`Unsupported media type: ${file.mimetype}`);
        //         }

        //         mediaIds.push(mediaId);

        //         // Clean up uploaded file
        //         fs.unlinkSync(file.path);
        //     }
        // }

        // const tweet = await twitterClient.v2.tweet({
        //     text: message,
        //     media: mediaIds.length ? { media_ids: mediaIds } : undefined,
        // });

        // res.status(201).json({ data: tweet });
    } catch (error) {
        res.status(400).json({ message: "An error occured!", details: `${error}` }); 
    }
});
// async function postTweet(text) {
//     try {
//         const { data } = await twitterClient.v2.tweet(text);
//         console.log('Tweet posted successfully:', data);
//     } catch (error) {
//         console.error('Error posting tweet:', error);
//     }
// }

// Example usage
// postTweet('Hello Twitter from my web app!');


export { tweet, postTweet };