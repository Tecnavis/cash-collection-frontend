import Footer from '../components/footer/Footer';
import CompanyHeader from '../components/header/CompanyHeader';
import CompanyFilter from '../components/filter/CompanyFilter';
import CompanyTable from '../components/tables/CompanyTable';

const CompanyMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                    <div className="panel-body">
                        <CompanyTable/>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default CompanyMainContent