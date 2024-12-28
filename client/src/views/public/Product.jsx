import { useParams } from 'react-router-dom'; 
import { useProductExt } from '@/hooks/external/useFakeStoreProduct.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 
import ProductComponent3 from '../../components/public/nested-components/ProductComponent3';


export default function Product() { 
    const params = useParams(); 
    const source = params?.source || 'shop'; 

    const { productExt, getProductExt } = useProductExt(params?.id); 
    console.log(productExt); 
    const { product, getProduct } = useProduct(params?.id); 
    console.log(product); 

    let productArticle;
    if (source == 'market') {
        productArticle = productExt; 
        console.log(productArticle); 
    } else if (source == 'shop') {
        productArticle = product; 
        console.log(productArticle); 
    }

    return (
        <Layout>

            <ProductComponent3 productArticle={ productArticle } />

        </Layout>
    )
}
