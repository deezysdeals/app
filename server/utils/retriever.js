import Product from '../models/Product.js'; 
import Order from '../models/Order.js'; 

const cosineSimilarity = (a, b) => {
    // Add validation for inputs
    if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
        return 0; // or throw an error if you prefer
    }
    if (a.length !== b.length) {
        return 0; // vectors must be of same length
    }
    
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

async function getRelevantProducts(queryEmbedding, limit = 3) {
    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
        throw new Error('Invalid query embedding');
    }
    
    // const products = await Product.find({ embedding: { $exists: true } }); // Only get products with embeddings
    const products = await Product.find(); // Only get products with embeddings
    const scored = products.map(p => ({
        product: p,
        score: cosineSimilarity(queryEmbedding, p.embedding)
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

async function getRelevantOrders(queryEmbedding, limit = 3) {
    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
        throw new Error('Invalid query embedding');
    }
    
    // const orders = await Order.find({ embedding: { $exists: true } }); // Only get orders with embeddings
    const orders = await Order.find(); // Only get orders with embeddings
    const scored = orders.map(o => ({
        order: o,
        score: cosineSimilarity(queryEmbedding, o.embedding) // Fixed typo: was 'p.embedding'
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { getRelevantProducts, getRelevantOrders };