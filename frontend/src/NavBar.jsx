import React from 'react';
import { Coffee } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const location = useLocation(); // Hook to get the current route location

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <span className="navbar-brand d-flex align-items-center">
          <Coffee className="me-2" /> Nutrition Tracker
        </span>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link btn ${location.pathname === '/' ? 'active' : ''}`}
              >
                Add Meals
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/summary" 
                className={`nav-link btn ${location.pathname === '/summary' ? 'active' : ''}`}
              >
                Daily Summary
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
