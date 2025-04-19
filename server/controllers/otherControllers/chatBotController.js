import asyncHandler from 'express-async-handler'; 
import { getEmbedding } from '../../utils/embeddings.js';
import { getRelevantProducts, getRelevantOrders } from '../../utils/retriever.js';
import { askLLM } from '../../utils/llm.js';


const chatBot = asyncHandler(async (req, res) => {
    const { question, userId } = req.body;

    // Step 1: Get query embedding
    const queryEmbedding = await getEmbedding(question);

    // Step 2: Retrieve relevant data
    const products = await getRelevantProducts(queryEmbedding);
    const orders = await getRelevantOrders(queryEmbedding, userId);

    // Step 3: Format context
    const context = `
        **Products**: ${products.map(p => `${p.name} ($${p.price})`).join(', ')}
        **Orders**: ${orders.map(o => `Order #${o._id} (${o.status})`).join(', ')}
    `;

    // Step 4: Get LLM response
    const answer = await askLLM(context, question);

    res.json({ answer });
});


export { chatBot };