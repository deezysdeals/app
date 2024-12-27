import { Link } from 'react-router-dom'; 
import { route } from '@/routes';
import '@/assets/css/notFound.css'; 
import Layout from '../components/public/Layout.jsx'; 


export default function NotFound() {
  return (
    <Layout>
      <div className="not-found-container">
        <div className="not-found-content">
          <h2 className="error-code">404</h2>
          <p className="error-message">Oops! The page you're looking for cannot be found.</p>
          <p className="redirect-message">
            <Link to={ route('index') } className="text-decoration-none ps-1 fw-semibold text-white d-flex align-items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-arrow-left-circle-fill"
                  viewBox="0 0 16 16">
                  <path
                      d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
              <span className="fw-semibold fs-5">Go back Home</span>&nbsp;
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
