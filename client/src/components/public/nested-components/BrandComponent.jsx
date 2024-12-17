import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Logo from '@/assets/images/deezysdeals-logo.png'; 


export default function BrandComponent({ key, id, brand, imgSrc }) {
    return (
        <article> 
            <Link 
                key={ key }
                to={ route('brands.show', { id: id }) } 
                className="d-flex flex-column gap-2 text-decoration-none text-dark">
                    <span>
                        <img src={ imgSrc || Logo } style={{ width: '100px', height: '100px' }} alt="" className="object-fit-cover border-radius-35" />
                    </span>
                    <span className="fw-bold" style={{ textTransform: 'capitalize' }}>
                        { brand }
                    </span>
            </Link>
        </article>
    )
}
