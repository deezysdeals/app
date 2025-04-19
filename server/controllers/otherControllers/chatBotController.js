import asyncHandler from 'express-async-handler'; 
import { getEmbedding, indexProducts } from '../../utils/embeddings.js';
import { getRelevantProducts, getRelevantOrders } from '../../utils/retriever.js';
import { askLLM } from '../../utils/llm.js';


const chatBot = asyncHandler(async (req, res) => {
    const { question, userId } = req.body;

    // await indexProducts();

    // Step 1: Get query embedding
    const queryEmbedding = await getEmbedding(question);

    await indexProducts();

    // Step 2: Retrieve relevant data
    const products = await getRelevantProducts(queryEmbedding);
    const orders = await getRelevantOrders(queryEmbedding, userId);

    // Step 3: Format context
    const context = `
        Available Products:\n
        ${products.map(p => `- (name: ${p.title}): (price: $${p.retail_price}) (ID: ${p._id})`).join('\n')}
        
        \n
        \n

        User's Recent Orders:\n
        ${orders.map(o => `- Order #${o._id} (${o.payment_mode})`).join('\n')}
    `;

    // Step 4: Get LLM response
    const answer = await askLLM(context, question);

    // const response = answer?.slice(7);

    // res.json({ response });
    res.json({ answer });
});


export { chatBot };