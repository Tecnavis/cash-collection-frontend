import { useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';

const ComponentsPart = () => {
  const {
    componentState,
    toggleComponentMainDropdown,
    toggleAdvance,
    toggleSubComponentDropdown,
    layoutPosition,
    dropdownOpen,
    mainComponentRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen
  } = useContext(DigiContext);

  const {
    isMainDropdownOpen,
    advance,
    multipleLevel,
    firstLevel,
    secondLevel,
    isSubComponentDropdownOpen,
  } = componentState;

  useEffect(() => {
    localStorage.setItem('componentState', JSON.stringify(componentState));
  }, [componentState]);

  const handleSubNavLinkClick = () => {
    if (!isSubComponentDropdownOpen) {
      toggleSubComponentDropdown(); 
    }
  };


  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainComponentRef : null}>
    {/* <Link
      role="button"
      className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
      onClick={toggleComponentMainDropdown}
    >
      Components
    </Link> */}
    <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.component ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>       
      {/* <li className="sidebar-dropdown-item">
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/form" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-memo-pad"></i>
            </span>{' '}
            <span className="sidebar-txt">Forms</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
            <NavLink to="/sweetAlert" className="sidebar-link" onClick={handleSubNavLinkClick}>
              Sweet Alert
            </NavLink>
          </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/table" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-table"></i>
            </span>{' '}
            <span className="sidebar-txt">Tables</span>
          </NavLink>
        </li> 
        <li className="sidebar-dropdown-item">
          <NavLink to="/charts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-chart-simple"></i>
            </span>{' '}
            <span className="sidebar-txt">Charts</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default ComponentsPart;
