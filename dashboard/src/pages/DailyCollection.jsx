import React from 'react';
import Footer from '../components/footer/Footer';
import DailyCollectionTable from '../components/tables/DailyCollectionTable';

const DailyCollectionMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    
                    <div className="panel-body">
                        <DailyCollectionTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default DailyCollectionMainContent;