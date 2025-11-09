//import { useContext } from 'react';
import './account.css';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  return (
    <div className="account-page-container">
      <section className="account-heading-container">
        <section className='account-heading-icon' onClick={() => navigate('/')}>
          <FaArrowLeft />
        </section>
        <section className="account-heading-text-container">
          <h1 className='account-heading'>My Account</h1>
          <p className='account-text'>Manage your account and preferences</p>
        </section>
      </section>
    </div>
  )
}

export default Account

