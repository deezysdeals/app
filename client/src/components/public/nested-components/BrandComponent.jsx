import Logo from '@/assets/images/deezysdeals-logo.png'; 


export default function BrandComponent({ name, imgSrc }) {
    return (
        <>
            <span>
                <img src={ imgSrc || Logo } style={{ width: '100px', height: '100px' }} alt="" className="object-fit-cover border-radius-35" />
            </span>
            <span className="fw-bold" style={{ textTransform: 'capitalize' }}>
                { name }
            </span>
        </>
    )
}
