import axios from 'axios';


async function askLLM(context, question) {
    // const response = await axios.post('https://5fa6-105-235-158-27.ngrok-free.app/api/chat', {
    const response = await axios.post('http://localhost:11434/api/chat', {
        model: "deepseek-r1:1.5b", // or "llama3" or "mistral"
        messages: [
            {
                // role: "system",
                // content: "You are a helpful assistant. Answer based on this context: " + context
                // content: "You are a helpful customer support chatbot for an e-commerce store. " +
                //         "Answer questions based on the provided context about products and orders: " + context
                role: "system",
                content: "You are a helpful assistant for an e-commerce store. Think through problems inside <think> tags. Only put final user-visible answers outside those tags." +
                        "Answer questions based on the provided context about products and orders: " + context
            },
            {
                role: "user",
                content: question
                // role: "user",
                // content: `Context: ${context}\n\nQuestion: ${question}`
            }
        ],
        stream: false
    });
    return response.data.message.content;
}


export { askLLM }