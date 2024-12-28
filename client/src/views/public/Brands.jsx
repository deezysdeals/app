import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useBrands } from '@/hooks/public/useBrands.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import BrandComponent from '@/components/public/nested-components/BrandComponent';
import Layout from '@/components/public/Layout.jsx'; 


export default function Brands() {
    const [brandQuery, setBrandQuery] = useState({ 
        page: 1, 
        limit: 100, 
    }); 
    const { brands, getBrands } = useBrands(brandQuery); 
    console.log(brands); 

    return (
        <Layout>
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main"> 
                    <section className="brands pt-5 d-flex flex-wrap gap-4">
                        { (brands?.data?.length > 0) && brands?.data?.map((brand, index) => {
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
                        })}
                    </section>

                    {/* <PaginationLinks />  */}
                    { (brands?.data?.length > 0) && 
                        <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop();  
                                    let previousPage = ((brands?.meta?.current_page >= 1) ? (brands?.meta?.current_page - 1) : 1)
                                    setBrandQuery(prevState => ({
                                        ...prevState, 
                                        page: previousPage
                                    })); 
                                    await getBrands(brandQuery); 
                                } }>
                                    <Previous /> 
                            </span> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    let nextPage = ((brands?.meta?.current_page < brands?.meta?.total_pages) ? (brands?.meta?.current_page + 1) : brands?.meta?.total_pages)
                                    setBrandQuery(prevState => ({
                                        ...prevState, 
                                        page: nextPage
                                    })); 
                                    await getBrands(brandQuery); 
                                } }>
                                <Next /> 
                            </span> 
                            {/* <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    // await getBrands(brands?.meta?.total_pages); 
                                    let lastPage = brands?.meta?.total_pages
                                    setBrandQuery(prevState => ({
                                        ...prevState,  
                                        page: lastPage
                                    })); 
                                    await getBrands(brandQuery); 
                                } }>
                                    <Last />
                            </span> */}
                        </section> 
                    }
                
                </div> 

            </section> 
        </Layout>
    )
}
