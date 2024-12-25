import { useState } from 'react';
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 


export default function TwitterX() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleTweetChange = (e) => {
        setMessage(e.target.value);
    };

    const handlePostTweet = async () => {
        if (!message) {
            setStatus('Please enter a message');
            return;
        }

        try {
            setStatus('Posting tweet...'); 
            const response = await axios.post(`${ Constants?.serverURL }/api/v1/twitter-x/tweet`, {
            message,
            });
            if (response.data.success) {
                setStatus('Tweet posted successfully!'); 
                console.log(response)
            } else {
                setStatus('Failed to post tweet');
            }
        } catch (error) {
            setStatus('Error posting tweet');
            console.error(error);
        }
    }; 

    return (
        <div>
            <h1>Post a Tweet</h1>
            <textarea
                value={message}
                onChange={handleTweetChange}
                rows="4"
                cols="50"
                placeholder="What's happening?"
            />
            <br />
            <button onClick={handlePostTweet}>Post Tweet</button>
            <p>{status}</p>
        </div>
    )
}
