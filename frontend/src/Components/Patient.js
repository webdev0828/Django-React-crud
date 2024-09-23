import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientModal from './PatientModal';
import '../style.css';

const Patient = ({ patientList }) => {
    // State for managing patient data and modal behavior
    const [patientData, setPatientData] = useState([]);
    const [changedEvent, setChangedEvent] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPatientCreate, setIsPatientCreate] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('date_of_birth');
    const [sortOrder, setSortOrder] = useState('asc');

    // Effect to initialize patient data and fetch patients when dependencies change
    useEffect(() => {
        // Fetch patient data from API
        const fetchPatients = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get('http://localhost:8000/api/patient_list/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page: currentPage,
                        sort_by: sortField,
                        order: sortOrder
                    }
                });
                setPatientData(response.data.patients);
                setTotalPages(response.data.num_pages);
            } catch (error) {
                console.log('Error getting patients : ' + error);
            }
        };

        if (patientList) {
            setPatientData(patientList);
        }
        fetchPatients();
    }, [patientList, changedEvent, currentPage, sortField, sortOrder]);

    // Handle adding or updating a patient
    const handlePatientChanged = () => {
        setChangedEvent(prev => !prev);
    };

    // Delete a patient record
    const handlePatientDelete = async (patientToDelete) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://localhost:8000/api/patients/${patientToDelete.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            handlePatientChanged();
        } catch (error) {
           alert('Failed to delete patient : ' + error);
        }
    };

    // Open modal for creating a new patient
    const handleCreatePatient = () => {
        setIsModalOpen(true);
        setIsPatientCreate(true);
        setPatientToEdit(null); // Reset patient to edit
    };

    // Open modal for editing an existing patient
    const handleEditPatient = (patient) => {
        setIsModalOpen(true);
        setIsPatientCreate(false);
        setPatientToEdit(patient); // Set the patient to be edited
    };

    // Handle page change for pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle sorting of patient data
    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };

    // Render patient table rows or a message when no data is available
    const renderPatientRows = () => {
        if (patientData.length === 0) {
            return (
                <tr>
                    <td colSpan="6">No patient data available</td>
                </tr>
            );
        }
        return patientData.map(patient => (
            <tr key={patient.id}>
                <td>{patient.full_name}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone_number}</td>
                <td>{patient.date_of_birth}</td>
                <td>{patient.address}</td>
                <td>
                    <button type="button" className="btn btn-success" onClick={() => handleEditPatient(patient)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handlePatientDelete(patient)}>Delete</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="table-area">
            <div>
                <button type="button" className="btn btn-primary create-button" onClick={handleCreatePatient}>Create</button>
            </div>

            <PatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isCreate={isPatientCreate}
                patientToEdit={patientToEdit}
                onPatientChanged={handlePatientChanged}
            />

            <table className="table table-striped">
                <thead>
                    <tr>
                        {['full_name', 'gender', 'phone_number', 'date_of_birth', 'address'].map(field => (
                            <th key={field} onClick={() => handleSort(field)}>{capitalizeFirstLetter(field.replace('_', ' '))}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderPatientRows()}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} disabled={currentPage === i + 1}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Patient;