import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useCategoriesExt } from '@/hooks/external/useFakeStoreCategories.jsx'; 
import { usePopularCategories } from '@/hooks/public/usePopularCategories.jsx'; 
import { useProductsExt } from '@/hooks/external/useFakeStoreProducts.jsx'; 
import { useFeaturedProducts } from '@/hooks/public/useFeaturedProducts.jsx'; 
import { usePopularProducts } from '@/hooks/public/usePopularProducts.jsx'; 
import { useTopRatedProducts } from '@/hooks/public/useTopRatedProducts.jsx'; 
import { useProducts } from '@/hooks/useProducts.jsx'; 
// import { useBrands } from '@/hooks/useBrands.jsx'; 
import { usePopularBrands } from '@/hooks/public/usePopularBrands.jsx'; 
import { useDeals } from '@/hooks/useDeals.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx';
import ProductComponent1 from '@/components/public/nested-components/ProductComponent1.jsx'; 
import DealComponent from '@/components/public/nested-components/DealComponent.jsx'; 
import BrandComponent from '@/components/public/nested-components/BrandComponent.jsx'; 


export default function Index() { 
    const { categoriesExt } = useCategoriesExt(); 
    const { productsExt } = useProductsExt(); 
    console.log(categoriesExt); 
    console.log(productsExt); 

    const { popularCategories } = usePopularCategories(); 
    console.log(popularCategories);
    const { featuredProducts } = useFeaturedProducts(); 
    console.log(featuredProducts);
    const { popularProducts } = usePopularProducts(); 
    console.log(popularProducts); 
    const { topRatedProducts } = useTopRatedProducts(); 
    console.log(topRatedProducts);

    let popularCategoriesList; 
    if (popularCategories?.data?.length > 0) {
        popularCategoriesList = popularCategories; 
        console.log(popularCategoriesList); 
    } else {
        popularCategoriesList = categoriesExt; 
        console.log(popularCategoriesList); 
    }; 

    let featuredProductsList; 
    if (featuredProducts?.data?.length > 0) {
        featuredProductsList = featuredProducts
    } else {
        featuredProductsList = productsExt;
    }; 

    let popularProductsList; 
    if (popularProducts?.data?.length > 0) {
        popularProductsList = popularProducts; 
    } else {
        popularProductsList = productsExt;
    }; 

    let topRatedProductsList; 
    if (topRatedProducts?.data?.length > 0) {
        topRatedProductsList = topRatedProducts;
    } else {
        topRatedProductsList = productsExt;
    }

    const { popularBrands, getPopularBrands } = usePopularBrands(); 
    console.log(popularBrands); 
    const [dealQuery, setDealQuery] = useState({ 
        page: 1, 
        limit: 20, 
    }); 
    const { deals, getDeals } = useDeals(dealQuery); 
    console.log(deals); 

    return (
        <Layout>
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main">
                    <section className="products featured-products pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Featured Products</h3> 

                        <div className="nav-scroller">
                            <nav className="nav justify-content-between py-3" style={{ height: '325px', overflowY: 'hidden' }}>

                                { (featuredProductsList?.data?.length > 0) && (featuredProductsList?.data?.map(product => { 
                                    const ratingCalculated = (Number(product?.total_rating_value) / Number(product?.total_rating_count)) || 5; 
                                    return (
                                        <ProductComponent1 
                                            key = { product?.id || product?._id } 
                                            itemId = { product?.id || product?._id } 
                                            asin = { product?.asin || product?.id } 
                                            imgSrc =  { product?.images }
                                            title = { product?.title } 
                                            description = '' 
                                            oldPrice = { product?.initial_retail_price && Number(product?.initial_retail_price)?.toFixed(2) }
                                            currentPrice = { Number(product?.retail_price)?.toFixed(2) } 
                                            rating = { ratingCalculated || product?.rating?.rate } 
                                            category = { product?.category } />
                                    )
                                }))}
                            </nav>
                        </div> 

                        <div className="d-flex px-2 pt-3">
                            <span className="btn btn-sm btn-dark border-radius-35">
                                <Link to={ route('products.index', { source: 'shop' }) } className="text-decoration-none ps-1 fw-semibold text-white d-flex align-items-center">
                                    <span className="fw-semibold">See more products</span>&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                    </svg>
                                </Link>
                            </span>
                        </div> 
                    </section> 

                    <section className="products pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Popular Products</h3> 

                        <div className="nav-scroller">
                            <nav className="nav justify-content-between py-3" style={{ height: '325px', overflowY: 'hidden' }}>

                                { (popularProductsList?.data?.length > 0) && (popularProductsList?.data?.map(product => {
                                    const ratingCalculated = (Number(product?.total_rating_value) / Number(product?.total_rating_count)) || 5; 
                                    return (
                                        <ProductComponent1 
                                            key = { product?.id || product?._id } 
                                            asin = { product?.asin || product?.id } 
                                            imgSrc =  { product?.images }
                                            title = { product?.title } 
                                            description = '' 
                                            oldPrice = { product?.initial_retail_price && Number(product?.initial_retail_price)?.toFixed(2) }
                                            currentPrice = { Number(product?.retail_price)?.toFixed(2) } 
                                            rating = { ratingCalculated || product?.rating?.rate } 
                                            category = { product?.category } />
                                    )
                                }))}
                        
                            </nav>
                        </div> 

                        <div className="d-flex px-2 pt-3">
                            <span className="btn btn-sm btn-dark border-radius-35">
                                <Link to={ route('products.index', { source: 'shop' }) } className="text-decoration-none ps-1 fw-semibold text-white d-flex align-items-center">
                                    <span className="fw-semibold">See more products</span>&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                    </svg>
                                </Link>
                            </span>
                        </div>
                    </section> 

                    <section className="top-rated pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Top-Rated</h3> 

                        <div className="nav-scroller">
                            <nav className="nav justify-content-between py-3" style={{ height: '325px', overflowY: 'hidden' }}>
                        
                                { (topRatedProductsList?.data?.length > 0) && (topRatedProductsList?.data?.map(product => {
                                    const ratingCalculated = (Number(product?.total_rating_value) / Number(product?.total_rating_count)) || 5; 
                                    // console.log('rating calculated', ratingCalculated);
                                    return (
                                        <ProductComponent1 
                                            itemId = { product?.id || product?._id } 
                                            asin = { product?.asin || product?.id } 
                                            imgSrc =  { product?.images }
                                            title = { product?.title } 
                                            description = '' 
                                            oldPrice = { product?.initial_retail_price && Number(product?.initial_retail_price)?.toFixed(2) } 
                                            currentPrice = { Number(product?.retail_price)?.toFixed(2) } 
                                            rating = { ratingCalculated || product?.rating?.rate } 
                                            category = { product?.category } /> 
                                    )
                                }))}
                        
                            </nav>
                        </div>
                    </section> 

                    <section className="categories pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Popular Categories</h3>
                    
                        <div className="nav-scroller">
                            <nav className="nav justify-content-between py-4"> 

                                {(popularCategoriesList?.data?.length > 0) && (popularCategoriesList?.data?.map((category, index) => {
                                    console.log(category);
                                    return (
                                        <article key={ category?._id || category?.toString() } className="">
                                            <Link to={ route('categories.show', { id: (category?._id || category?.toString()) }) } className="btn btn-outline-dark border-radius-35 px-5 py-2 fw-bold text-decoration-none text-capitalize">{ (category?.name || category?.toString()) }</Link>
                                        </article> 
                                    )
                                }))}

                            </nav>
                        </div> 

                        <div className="d-flex px-2 pt-3">
                            <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                <Link to={ route('categories.index') } className="text-decoration-none ps-1 fw-semibold text-white">
                                    <span className="fw-semibold">See more categories</span>&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                    </svg>
                                </Link>
                            </span>
                        </div>
                    </section>

                    <section className="deals pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Deals</h3> 

                        <div className="nav-scroller">
                            <nav className="nav justify-content-between py-3">
                                { (deals?.data?.length > 0) && deals?.data?.map((deal, index) => {
                                    return (
                                        <DealComponent 
                                            key={ deal?._id } 
                                            id={ deal?._id } 
                                            title={ deal?.title } 
                                            description={ deal?.description } 
                                            imgSrc={ deal?.image_path?.url } /> 
                                    )
                                })}
                            </nav>
                        </div>
                    </section> 

                    <section className="brands pt-5">
                        <h3 className="fw-bold border-bottom pb-2 fs-4">Popular Brands</h3> 

                        <div className="nav-scroller py-1 mb-3">
                            <nav className="nav justify-content-between py-3">
                                { (popularBrands?.data?.length > 0) && popularBrands?.data?.map((brand, index) => {
                                    return ( 
                                        <article key={ brand?._id } className="">
                                            <Link 
                                                to={ route('brands.show', { id: brand?._id }) } className="text-dark text-decoration-none d-flex flex-column align-items-center gap-2">
                                                    <BrandComponent 
                                                        name={ brand?.name } 
                                                        imgSrc={ brand?.logo_path?.url} />
                                            </Link>
                                        </article>
                                    )
                                }) }
                                {/* <BrandComponent 
                                    brand='versace' 
                                    imgSrc='https://1000logos.net/wp-content/uploads/2017/03/Nestle-Logo.png' />
                                <BrandComponent brand='apple' imgSrc='https://www.pngplay.com/wp-content/uploads/3/Apple-Logo-Transparent-Images.png' />
                                <BrandComponent brand='p&g' imgSrc='https://logos-world.net/wp-content/uploads/2022/11/PG-Logo.png' />
                                <BrandComponent brand='nike' imgSrc='https://www.pixelstalk.net/wp-content/uploads/2015/12/nike-logo-wallpaper-hd-white.jpg' /> 
                                <BrandComponent brand='chanel' imgSrc='https://turbologo.com/articles/wp-content/uploads/2019/10/chanel-logo-illustration.jpg' /> 
                                <BrandComponent brand='windows' imgSrc='https://www.wallpaperflare.com/static/975/1009/308/windows-8-windows-10-blue-logo-wallpaper.jpg' /> 
                                <BrandComponent brand='gucci' imgSrc='https://www.pixelstalk.net/wp-content/uploads/2016/04/Gucci-logo-wallpapers-HD-pictures-images.jpg' /> 
                                <BrandComponent brand='versace' imgSrc='https://vectorified.com/image/versace-logo-vector-11.jpg' /> 
                                <BrandComponent brand='adidas' imgSrc='https://i.pinimg.com/originals/57/58/22/575822c5381ea91c21bfd2c69b359e24.png' /> 
                                <BrandComponent brand='reebok' imgSrc='https://static.vecteezy.com/system/resources/previews/023/867/293/original/reebok-logo-brand-clothes-with-name-white-symbol-design-icon-abstract-illustration-with-black-background-free-vector.jpg' />  */}
                        
                            </nav>
                        </div> 

                        <div className="d-flex px-2">
                            <span className="btn btn-sm btn-dark border-radius-35">
                                <Link 
                                    to={ route('brands.index') } 
                                    className="d-flex align-items-center text-decoration-none ps-1 fw-semibold text-white">
                                        <span className="fw-semibold">See more brands</span>&nbsp;
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                        </svg>
                                </Link>
                            </span>
                        </div>
                    </section> 
                </div> 

            </section>
        </Layout>
    )
}
