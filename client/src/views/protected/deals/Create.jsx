import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useDeal } from '@/hooks/useDeal.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() { 
    const [userSpecific, setUserSpecific] = useState(false); 
    const [usableOnce, setUsableOnce] = useState(false); 

    const { deal, createDeal, getDeal } = useDeal(); 

    async function submitDeal(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        formData.append('code', deal.data.code); 
        formData.append('title', deal.data.title); 
        formData.append('description', deal.data.description); 
        formData.append('value', deal.data.deal_value); 
        formData.append('value_unit', deal.data.deal_value_unit); 
        formData.append('specific_for_user', userSpecific ? true : false); 
        userSpecific && formData.append('user_specifically_for', deal.data.user_specifically_for); 
        formData.append('usable_once', usableOnce ? true : false); 

        await createDeal(formData); 
    }

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.deals.index') } className="text-dark">
                            Deals
                        </Link>&nbsp;
                        | Create</h2>

                    <section className="py-4">
                        <form onSubmit={ submitDeal } encType='multipart/form-data' id="create-edit-form" className="create-edit-form">
                            <div className="fields"> 

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold form-field-required">Title</span>
                                                <input 
                                                    type="text" 
                                                    value={ deal?.data?.title ?? '' } 
                                                    onChange={ e => deal.setData({
                                                        ...deal?.data,
                                                        title: e.target.value,
                                                    }) }
                                                    placeholder="e.g. X-Mas Sales" 
                                                    id="title" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Deal TITLE" 
                                                    aria-describedby="deal title" 
                                                    required />
                                            </div>
                                            <div className="form-text px-3"><small>The deal title (as to be seen on the website).</small></div>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold form-field-required">Code</span>
                                                <input 
                                                    type="text" 
                                                    value={ deal?.data?.code ?? '' } 
                                                    onChange={ e => deal.setData({
                                                        ...deal?.data,
                                                        code: e.target.value,
                                                    }) }
                                                    placeholder="e.g. XMAS2024" 
                                                    id="code" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Deal Code" 
                                                    aria-describedby="deal code" 
                                                    required />
                                            </div>
                                            <div className="form-text px-3"><small>The code of your deal (to be used by clients for redemption).</small></div>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div className="description row g-2">
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-radius-35 fw-semibold fs-6 form-field-required">Description</span>
                                            <textarea 
                                                value={ deal?.data?.description ?? '' } 
                                                onChange={ e => deal.setData({
                                                    ...deal?.data,
                                                    description: e.target.value,
                                                }) }
                                                placeholder="e.g. Buy every hat from 1st - 31st December with a 5% discount." 
                                                id="description" 
                                                className="form-control border-radius-35" 
                                                aria-label="Deal Description" 
                                                aria-describedby="deal description" 
                                                required ></textarea>
                                        </div> 
                                        <div className="form-text px-3" id="desription"><small>Description of Deal.</small></div>
                                    </div>
                                </div> 

                                <div className="value row g-2">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold form-field-required">Value</span>
                                                <input 
                                                    type="number" 
                                                    value={ deal?.data?.deal_value ?? '' } 
                                                    onChange={ e => deal.setData({
                                                        ...deal?.data,
                                                        deal_value: e.target.value,
                                                    }) }
                                                    placeholder="e.g. 12" 
                                                    id="deal_value" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Deal value" 
                                                    aria-describedby="deal value" 
                                                    required />
                                                <select 
                                                    value={ deal?.data?.deal_value_unit ?? '' } 
                                                    onChange={ e => deal.setData({
                                                        ...deal?.data,
                                                        deal_value_unit: e.target.value,
                                                    }) } 
                                                    id="deal_value_unit" 
                                                    aria-label="Deal value unit" 
                                                    aria-describedby="deal value unit" 
                                                    className="form-select border-radius-35">
                                                        <option value="usd">USD</option>
                                                        <option value="percentage">%</option> 
                                                </select>
                                            </div>
                                            <div className="form-text px-3"><small>The deal value and the unit (USD or percentage).</small></div>
                                        </div>
                                    </div>
                                </div> 

                                <div className="specified-user row g-2">
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center gap-1 px-3 py-2">
                                                { (userSpecific == true) 
                                                    ?   <span 
                                                            type="button" 
                                                            onClick={ () => setUserSpecific(false) }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                                    <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                                </svg>
                                                        </span>
                                                    : (userSpecific == false) 
                                                        ?   <span 
                                                                type="button" 
                                                                onClick={ () => setUserSpecific(true) }>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                                    </svg>
                                                            </span>
                                                                : '' } 
                                                            <span>Specify if it is for a specific user.</span>
                                            </div>
                                        </div>
                                    </div>
                                    { userSpecific && 
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold form-field-required">User Specifically For</span>
                                                    <input 
                                                        type="text" 
                                                        value={ deal?.data?.user_specifically_for ?? '' } 
                                                        onChange={ e => deal.setData({
                                                            ...deal?.data,
                                                            user_specifically_for: e.target.value,
                                                        }) }
                                                        placeholder="e.g. @paedaezi" 
                                                        id="user_specifically_for" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Deal Useruser_specifically_for" 
                                                        aria-describedby="deal user_specifically_for" 
                                                        required />
                                                </div>
                                                <div className="form-text px-3"><small>The username of the user the deal is specifically meant for.</small></div>
                                            </div>
                                        </div>    
                                    }
                                </div>

                                <div className="usability row g-2">
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center gap-1 px-3 py-2">
                                                { (usableOnce == true) 
                                                    ?   <span 
                                                            type="button" 
                                                            onClick={ () => setUsableOnce(false) }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                                    <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                                </svg>
                                                        </span>
                                                    : (usableOnce == false) 
                                                        ?   <span 
                                                                type="button" 
                                                                onClick={ () => setUsableOnce(true) }>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                                    </svg>
                                                            </span>
                                                                : '' } 
                                                            <span>Set deal to be usable once.</span>
                                            </div>
                                        </div>
                                    </div> 
                                </div>

                            </div>

                            <div className="pt-3 d-flex justify-content-end">
                                <button type="submit" className={`btn btn-dark px-3 border-radius-35 ${deal?.loading == true && `disabled`}`}>
                                    <span>Save</span>&nbsp;
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle"
                                            viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </section> 
                </div> 
            </div>
        </Layout>
    )
}
