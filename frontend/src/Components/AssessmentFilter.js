import React, { useState } from 'react';

// AssessmentFilter component for filtering assessments
const AssessmentFilter = ({ isOpen, onClose, onFilterSet, patients }) => {
    // State variables to hold filter values
    const [assessmentType, setAssessmentType] = useState('');
    const [patientName, setPatientName] = useState('');
    const [datePerformed, setDatePerformed] = useState('');

    // Predefined assessment types
    const assessmentTypes = ['Cognitive Status', 'Physical Health', 'Mental Health', 'Nutrition', 'Other'];

    // Handles form submission to apply filters
    const handleSubmit = (e) => {
        e.preventDefault();
        const filters = { assessmentType: assessmentType, patientName: patientName, datePerformed: datePerformed };
        onFilterSet(filters); // Pass filters back to parent component
    };

    // Render nothing if modal is not open
    if (!isOpen) return null;

    return (
        <div className="action-modal-overlay">
            <div className="action-modal">
                <form onSubmit={handleSubmit}>
                    {/* Assessment Type Selection */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Assessment Type:</label>
                        <select
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select Assessment Type</option>
                            {assessmentTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Patient Selection */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Patient:</label>
                        <select
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select Patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.full_name}>{patient.full_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Assessment Date Input */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Assessment Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={datePerformed}
                            onChange={(e) => setDatePerformed(e.target.value)}
                        />
                    </div>

                    {/* Modal Action Buttons */}
                    <div className="mb-3 mt-3">
                        <div className="modal-actions">
                            <button type="submit" className="btn btn-primary">Filter</button>
                            <button type="button" className="btn btn-primary cancel-button" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssessmentFilter;