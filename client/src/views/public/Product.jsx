import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useProductExt } from '@/hooks/external/useFakeStoreProduct.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import formatNumber from '@/utils/FormatNumber.jsx';
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Product() { 
    const params = useParams(); 
    const source = params?.source; 

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

            <section className="grid grid-order-reverse pt-3 px-3"> 

                    <Aside />

                    <div className="main">
                        <section className="products pt-3">
                            <article className="card border-0 mb-5">
                                <a href="#" className="text-decoration-none text-dark">
                                    <div className="row align-items-center g-3">
                                        <div className="col-sm-12 col-md-5">
                                            <div id="carouselExample" className="carousel slide">
                                                <div className="carousel-inner position-relative" style={{ width: '225px', height: '250px' }}>
                                                    { params?.source == 'market' && 
                                                        <div className="images">
                                                            { (productArticle?.data?.image?.length > 0) && (productArticle?.data?.image?.map((image, index) => {
                                                                return (
                                                                    <div className={`carousel-item ${(index==0) && `active`}`}>
                                                                        <img src={ image } className="d-block img-fluid object-fit-cover border-radius-35" style={{ width: '225px', height: '250px' }} alt="..." />
                                                                    </div>
                                                                )
                                                            }))} 
                                                        </div> 
                                                    }
                                                    { params?.source == 'shop' && 
                                                        <div className="images">
                                                            { (productArticle?.data?.images?.length > 0) && (productArticle?.data?.images?.map((image, index) => {
                                                                return (
                                                                    <div className={`carousel-item ${(index==0) && `active`}`}>
                                                                        <img src={ image?.image_path?.url } className="d-block img-fluid object-fit-cover border-radius-35" style={{ width: '225px', height: '250px' }} alt="..." />
                                                                    </div>
                                                                )
                                                            }))} 
                                                        </div> 
                                                    }

                                                    <div>
                                                        <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                </svg>
                                                            </span>
                                                            <span className="visually-hidden">Previous</span>
                                                        </button>
                                                        <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                                </svg>
                                                            </span>
                                                            <span className="visually-hidden">Next</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div className="card-body d-flex flex-column gap-0">
                                                <h4 className="card-title fs-4 text-capitalize word-wrap">{ productArticle?.data?.title }</h4>
                                                {/* <span className="card-text">
                                                    <small>Options: <span className="fw-semibold">7 sizes</span>
                                                    </small>
                                                </span> */}
                                                { (productArticle?.data?.order_count>0) &&
                                                    <span className="card-text">{ formatNumber(Number(productArticle?.data?.order_count))} bought</span>
                                                }
                                                <span className="card-text">
                                                    { (Number(productArticle?.data?.initial_retail_price)>0) &&
                                                        <small>
                                                            <s>${ Number(productArticle?.data?.initial_retail_price) }</s>&nbsp;
                                                        </small> 
                                                    }
                                                    <span className="fw-semibold fs-1">
                                                        ${ Number(productArticle?.data?.retail_price) || Number(productArticle?.data?.price) }
                                                    </span>
                                                </span>
                                                <span className="card-text">
                                                    <small>
                                                        <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">Save $15.00</span>&nbsp;with coupon
                                                    </small>
                                                </span>
                                                <span className="card-text">Delivery&nbsp;
                                                    <span className="fw-semibold">Fri, Aug 30</span>
                                                </span>
                                                <span>
                                                    <small>More Buying Choices:</small>
                                                    <small className="fw-semibold">$400.98(46 used & new offers)</small>
                                                </span>
                                                <div className="pt-2 d-flex gap-2">
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="" height="24"
                                                            fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                                                            <path
                                                                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                                            <path
                                                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        </section>

                        <section>
                            <h4 className="fw-semibold fs-5 border-bottom pb-2">About this item</h4> 

                            <div>
                                <ul>
                                    {
                                        (productArticle?.data?.descriptions?.length > 0) && 
                                        productArticle?.data?.descriptions.map((description, index) => {
                                            return (
                                            <li 
                                                key={ description?._id } 
                                                className=""
                                                // style={{ marginLeft: index == 0 ? 'unset' : 'initial' }}>
                                                style={{ marginLeft: 'unset' }}>
                                                { description?.content } 
                                            </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div> 

                            <div className="pt-4">
                                <span>
                                    <a href="#features" className="text-dark fw-semibold fs-6">View More Features</a>
                                </span>
                            </div>
                        </section>
                    </div>

            </section> 

            <section className="features px-3 pt-5">
                <details>
                    <summary>
                        <h4 className="fw-semibold fs-5 border-bottom pb-2">Features</h4>
                    </summary> 

                    <div id="features" className="pt-3">
                        {
                            (productArticle?.data?.features?.length > 0) && 
                            productArticle?.data?.features.map((feature, index) => {
                                return (
                                <li 
                                    key={ feature?._id } 
                                    className=""
                                    // style={{ marginLeft: index == 0 ? 'unset' : 'initial' }}>
                                    style={{ marginLeft: 'unset' }}>
                                    { feature?.content } 
                                </li>
                                );
                            })
                        }
                    </div>

                    <div className="table-responsive col-md-9 pt-4">
                        <table className="table table-hover align-middle">
                            <tbody>
                                {
                                    (productArticle?.data?.info?.length > 0) && 
                                    productArticle?.data?.info.map((infoItem, index) => {
                                        return (
                                            <tr key={ infoItem?._id }>
                                                <th scope="row">{ infoItem?.dynamic_data[0] }</th>
                                                <td colSpan="2">{ infoItem?.dynamic_data[1] }</td>
                                            </tr>
                                        );
                                    })
                                }
                                {/* <tr>
                                    <th scope="row">Standing screen display size</th>
                                    <td colSpan="2">15.6 Inches</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </details>
            </section>

        </Layout>
    )
}
