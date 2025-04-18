import axios from 'axios';


async function askLLM(context, question) {
    const response = await axios.post('http://localhost:11434/api/chat', {
        model: "deepseek-r1:1.5b", // or "llama3" or "mistral"
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant. Give responses of maximum of two sentences. Go straight to the point. Do not include \"<think>\" in your responses. Answer based on this context: " + context
            },
            {
                role: "user",
                content: question
            }
        ],
        stream: false
    });
    return response.data.message.content;
}


export { askLLM }