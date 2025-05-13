import React from 'react'
import Footer from '../components/footer/Footer'
import InputExampleSection from '../components/forms/InputExampleSection'
import FIleInputSection from '../components/forms/FIleInputSection'
import InputGroupSection from '../components/forms/InputGroupSection'
import InputSizingSection from '../components/forms/InputSizingSection'
import InputGroupSizingSection from '../components/forms/InputGroupSizingSection'
import MultipleInputSection from '../components/forms/MultipleInputSection'
import ButtonGroupSection from '../components/forms/ButtonGroupSection'
import DropdownButtonSection from '../components/forms/DropdownButtonSection'
import FormLayoutSection from '../components/forms/FormLayoutSection'
import FileUploaderSection from '../components/forms/FileUploaderSection'
import RichTextEditorSection from '../components/forms/RichTextEditorSection'

const FormMainContent = () => {
  return (
    <div className="main-content">
        <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
            <h2>Form Elements</h2>
        </div>
        <div className="row">
            <div className="col-lg-6">
                <InputExampleSection/>
                <FIleInputSection/>
                <InputGroupSection/>
            </div>
            <div className="col-lg-6">
                <InputSizingSection/>
                <InputGroupSizingSection/>
                <MultipleInputSection/>
                <ButtonGroupSection/>
                <DropdownButtonSection/>
            </div>
            <FormLayoutSection/>
            <FileUploaderSection/>
            <RichTextEditorSection/>
        </div>

        <Footer/>
    </div>
  )
}

export default FormMainContent