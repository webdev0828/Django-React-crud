import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssessmentModal from './AssessmentModal';
import AssessmentFilter from './AssessmentFilter';

// Main Assessment component responsible for listing assessments and managing assessment actions
const Assessment = ({ assessmentList, patientList }) => {
    // State variables
    const [patientData, setPatientData] = useState([]); // Stores patient data
    const [changedEvent, setChangedEvent] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]); // Stores assessment data
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controls filter modal visibility
    const [isAssessmentCreate, setIsAssessmentCreate] = useState(false); // Tracks if an assessment is being created
    const [assessmentToEdit, setAssessmentToEdit] = useState(null); // Stores assessment to edit
    const [currentPage, setCurrentPage] = useState(1); // Current pagination page
    const [totalPages, setTotalPages] = useState(1); // Total pagination pages
    const [sortField, setSortField] = useState('assessment_date'); // Field to sort by
    const [sortOrder, setSortOrder] = useState('asc'); // Sort order

    // Store filter values in state
    const [filterParams, setFilterParams] = useState({
        assessmentType: '',
        patientName: '',
        datePerformed: ''
    });

    // Update patient and assessment data when props change
    useEffect(() => {
        // Fetch assessments based on current state and filters
        const fetchAssessments = async () => {
            const token = localStorage.getItem('access_token');
            const { assessmentType, patientName, datePerformed } = filterParams;

            try {
                const response = await axios.get('http://localhost:8000/api/assessments_list/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page: currentPage,
                        sort_by: sortField,
                        order: sortOrder,
                        assessment_type: assessmentType,
                        patient: patientName,
                        date_performed: datePerformed,
                    }
                });
                setAssessmentData(response.data.assessments);
                setTotalPages(response.data.num_pages);
            } catch (error) {
                console.log('Error getting assessments : ' + error);
            }
        };

        if (assessmentList) setAssessmentData(assessmentList);
        if (patientList) setPatientData(patientList);
        fetchAssessments();
    }, [assessmentList, patientList, changedEvent, currentPage, sortField, sortOrder, filterParams]);

    // Handle filter application
    const handleFilterSet = (filters) => {
        setFilterParams(filters); // Store the current filters
        setCurrentPage(1); // Reset to the first page
        setIsFilterModalOpen(false); // Close the filter modal
    };

    // Handle assessment creation or update
    const handleAssessmentChanged = () => {
        setChangedEvent(prev => !prev);
    };

    // Handle assessment deletion
    const handleAssessmentDelete = async (deleteAssessment) => {
        const token = localStorage.getItem('access_token');

        try {
            await axios.delete(`http://localhost:8000/api/assessments/${deleteAssessment.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            handleAssessmentChanged();
        } catch (error) {
            alert('Failed to delete assessment : ', error);
        }
    };

    // Open modal for creating a new assessment
    const openCreateModal = () => {
        setIsModalOpen(true);
        setIsAssessmentCreate(true);
        setAssessmentToEdit(null); // Clear assessmentToEdit
    };

    // Open modal for filtering assessments
    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    // Open modal for editing an existing assessment
    const openEditModal = (assessment) => {
        setIsModalOpen(true);
        setIsAssessmentCreate(false);
        setAssessmentToEdit(assessment);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle sorting assessments
    const handleSort = (field) => {
        setSortField(field);
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc')); // Toggle sort order
    };

    // Render assessment table rows
    const renderAssessmentRows = () => {
        if (assessmentData.length === 0) {
            return (
                <tr>
                    <td colSpan="6">No Assessment data available</td>
                </tr>
            );
        }

        return assessmentData.map((assessment) => (
            <tr key={assessment.id}>
                <td>{assessment.assessment_type}</td>
                <td>
                    {patientData.length > 0
                        ? patientData.find((patient) => patient.id === assessment.patient)?.full_name || 'Unknown Patient'
                        : 'Loading...'}
                </td>
                <td>{assessment.assessment_date}</td>
                <td>
                    <div id={`accordion${assessment.id}`}>
                        {assessment.questions_and_answers.map((item, index) => (
                            <div className="card" key={index}>
                                <div className="card-header">
                                    <a className="btn" data-bs-toggle="collapse" href={`#collapse${index}${assessment.id}`}>
                                        Question: {item.question}
                                    </a>
                                </div>
                                <div id={`collapse${index}${assessment.id}`} className="collapse" data-bs-parent={`#accordion${assessment.id}`}>
                                    <div className="card-body">{item.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </td>
                <td>{assessment.final_score}</td>
                <td>
                    <button type="button" className="btn btn-success" onClick={() => openEditModal(assessment)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleAssessmentDelete(assessment)}>Delete</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="table-area">
            {/* Buttons to open modals */}
            <div className="assessment-button-area">
                <button type="button" className="btn btn-primary assessment-create-button" onClick={openCreateModal}>Create</button>
                <button type="button" className="btn btn-dark filter-button" onClick={openFilterModal}>Filter</button>
            </div>

            {/* Modal component for creating or editing assessments */}
            <AssessmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isCreate={isAssessmentCreate}
                assessmentToEdit={assessmentToEdit}
                onAssessmentChanged={handleAssessmentChanged}
                patients={patientData}
            />

            {/* Filter modal for assessments */}
            <AssessmentFilter 
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onFilterSet={handleFilterSet}
                patients={patientData}
            />

            {/* Table displaying assessments */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('assessment_type')}>Assessment Type</th>
                        <th onClick={() => handleSort('patient')}>Patient</th>
                        <th onClick={() => handleSort('assessment_date')}>Assessment Date</th>
                        <th>Questions and Answers</th>
                        <th onClick={() => handleSort('final_score')}>Final Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{renderAssessmentRows()}</tbody>
            </table>

            {/* Pagination controls */}
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

export default Assessment;