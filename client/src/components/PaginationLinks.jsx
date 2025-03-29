import scrollToTop from '@/utils/ScrollToTop.jsx';


export default function PaginationLinks({ items, 
                                            getItems, 
                                            query,
                                            setQuery, 
                                            type }) {
    return (
        <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2">
            <span 
                type="button" 
                onClick={ async () => {
                    let firstPage = 1
                    setQuery(prevState => ({
                        ...prevState, 
                        page: firstPage 
                    })); 
                    await getItems(); 
                    await scrollToTop(); 
                } }
                className="btn btn-dark px-3 border-radius-35">
                    <span>
                        1
                    </span>
            </span>
            <span 
                type="button" 
                onClick={ async () => {
                    let previousPage = ((items?.meta?.current_page >= 1) ? (items?.meta?.current_page - 1) : 1)
                    setQuery(prevState => ({
                        ...prevState, 
                        page: previousPage
                    })); 
                    await getItems(); 
                    await scrollToTop(); 
                } }
                className="btn btn-dark px-3 border-radius-35 d-flex gap-2">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </span>
                    <span className="d-none d-md-block">
                        Previous
                    </span>
            </span>
            <span 
                type="button" 
                onClick={ async () => { 
                    let nextPage = ((items?.meta?.current_page < items?.meta?.total_pages) ? (items?.meta?.current_page + 1) : items?.meta?.total_pages)
                    setQuery(prevState => ({
                        ...prevState, 
                        page: nextPage
                    })); 
                    await getItems(); 
                    await scrollToTop(); 
                } } 
                className="btn btn-dark px-3 border-radius-35 d-flex gap-2">
                    <span className="d-none d-md-block">
                        Next
                    </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg>
                </span>
            </span>
            <span 
                type="button" 
                onClick={ async () => { 
                    let lastPage = items?.meta?.total_pages
                    setQuery(prevState => ({
                        ...prevState, 
                        page: lastPage
                    })); 
                    await getItems(); 
                    await scrollToTop(); 
                } } 
                className="btn btn-dark px-3 border-radius-35">
                    <span>
                        Last
                    </span>
            </span>
        </section>
    )
}
