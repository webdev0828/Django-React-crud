import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';

// Initial state object for form fields to avoid repetition
const initialState = {
    full_name: '',
    gender: '',
    phone_number: '',
    date_of_birth: '',
    address: ''
};

const PatientModal = ({ isOpen, onClose, isCreate, patientToEdit, onPatientChanged }) => {
    // State to manage form data using a single object
    const [formData, setFormData] = useState(initialState);

    // Destructure form fields for easier access
    const { full_name, gender, phone_number, date_of_birth, address } = formData;

    // Handle dynamic input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Populate form fields when editing or reset them for new patient
    useEffect(() => {
        if (isCreate) {
            setFormData(initialState); // Reset fields for new patient
        } else if (patientToEdit) {
            setFormData({
                full_name: patientToEdit.full_name || '',
                gender: patientToEdit.gender || '',
                phone_number: patientToEdit.phone_number || '',
                date_of_birth: patientToEdit.date_of_birth || '',
                address: patientToEdit.address || ''
            });
        }
    }, [isCreate, patientToEdit]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        
        try {
            const url = isCreate
                ? 'http://localhost:8000/api/patients/'   // URL for creating a patient
                : `http://localhost:8000/api/patients/${patientToEdit.id}/`;  // URL for updating a patient

            const method = isCreate ? 'post' : 'put';   // HTTP method based on operation

            await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }, // Include the token in headers
            });

            onPatientChanged(); // Notify parent component of changes
            onClose(); // Close modal after successful submission
        } catch (error) {
            alert('Failed to save patient data : ' + error.data);
        }
    };

    // Render nothing if modal is not open
    if (!isOpen) return null;

    return (
        <div className="action-modal-overlay">
            <div className="action-modal">
                <center>
                    <h2>{isCreate ? 'Add Patient' : 'Edit Patient'}</h2>
                </center>
                <form onSubmit={handleSubmit}>
                    {/** Form fields for patient data */}
                    <FormField 
                        label="Full Name:" 
                        type="text" 
                        name="full_name" 
                        value={full_name} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <FormField 
                        label="Gender:" 
                        type="text" 
                        name="gender" 
                        value={gender} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <FormField 
                        label="Phone Number:" 
                        type="text" 
                        name="phone_number" 
                        value={phone_number} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <FormField 
                        label="Date of Birth:" 
                        type="date" 
                        name="date_of_birth" 
                        value={date_of_birth} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <FormField 
                        label="Address:" 
                        type="textarea" 
                        name="address" 
                        value={address} 
                        onChange={handleInputChange} 
                        required 
                    />

                    {/** Form action buttons */}
                    <div className="modal-actions mb-3 mt-3">
                        <button type="submit" className="btn btn-primary">OK</button>
                        <button type="button" className="btn btn-primary cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/** 
 * Reusable component for form fields 
 */
const FormField = ({ label, type, name, value, onChange, required }) => (
    <div className="mb-3 mt-3">
        <label className="form-label">{label}</label>
        {type === 'textarea' ? (
            <textarea
                name={name}
                className="form-control"
                placeholder={label}
                value={value}
                onChange={onChange}
                required={required}
            />
        ) : (
            <input
                type={type}
                className="form-control"
                name={name}
                placeholder={label}
                value={value}
                onChange={onChange}
                required={required}
            />
        )}
    </div>
);

export default PatientModal;