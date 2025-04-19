import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
// import { useProductsExt } from '@/hooks/external/useFakeStoreProducts.jsx'; 
import { useSuggestedProducts } from '@/hooks/public/useSuggestedProducts.jsx';
import ProductComponent1 from '@/components/public/nested-components/ProductComponent1.jsx'; 


export default function Suggestions() { 
    // const { productsExt } = useProductsExt(); 
    // console.log(productsExt)

    const { suggestedProducts } = useSuggestedProducts();
    console.log(suggestedProducts)
    
    return (
        <section className="suggestions pt-5 mt-2 px-3">
            <h3 className="fw-bold border-bottom pb-2 fs-4">You Might Also Like</h3> 

            <div className="nav-scroller">
                <nav className="nav w-100 justify-content-between py-3" style={{ height: '325px', overflowY: 'hidden' }}>
            
                    { (suggestedProducts?.data?.length > 0) && (suggestedProducts?.data?.map(product => {
                        // let rating = ((product?.five_star_rating_count + product?.four_star_rating_count + product?.three_star_rating_count + product?.two_star_rating_count + product?.one_star_rating_count) / 20);
                        let ratingCalculated = (Number(product?.total_rating_value) / Number(product?.total_rating_count)) || 5; 
                        return (
                            <ProductComponent1 
                                key = { product?._id } 
                                itemId = { product?._id } 
                                asin = { product?.asin } 
                                imgSrc =  { product?.images[0]?.hi_res ?? product?.images?.[0] }
                                title = { product?.title } 
                                description = '' 
                                oldPrice = { product?.initial_retail_price ?? '' }  
                                currentPrice = { product?.retail_price } 
                                // rating = { product?.rating?.rate } 
                                rating = { ratingCalculated ?? product?.rating?.rate } 
                                category = { product?.category } />
                        )
                    }))}
            
                </nav>
            </div>
        </section>
    )
}
