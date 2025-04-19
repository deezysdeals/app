import { pipeline } from '@xenova/transformers'; 
import Product from '../models/Product.js'; 

let embedder;

async function getEmbedding(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid text input for embedding');
    }
    
    if (!embedder) {
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

async function indexProducts() {
    const products = await Product.find({ deleted_at: null });
    // console.log(products)
    for (const product of products) {
        try {
            const text = `${product.title}`;
            if (text) {
                product.embedding = await getEmbedding(text);
                await product.save();
            }
        } catch (error) {
            console.error(`Failed to index product ${product._id}:`, error);
        }
    }
}

export { getEmbedding, indexProducts };