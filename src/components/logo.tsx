
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../components/img/logo-black.png';
import './styles/header.scss'

const Logo: React.FC = () => (
  <div className="logo-name">
    <Link to="/">
      <img src={logo} alt="logo" />
    </Link>
  </div>
);

export default Logo;
