import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';

const AssessmentModal = ({ 
    isOpen, 
    onClose, 
    isCreate, 
    assessmentToEdit, 
    onAssessmentChanged, 
    patients 
}) => {
    // State variables for managing form fields
    const [selectedAssessmentType, setSelectedAssessmentType] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [assessmentDate, setAssessmentDate] = useState('');
    const [finalScore, setFinalScore] = useState('');
    const [questionsAnswers, setQuestionsAnswers] = useState([{ question: '', answer: '' }]);

    // Predefined assessment types
    const assessmentTypes = ['Cognitive Status', 'Physical Health', 'Mental Health', 'Nutrition', 'Other'];

    // Reset form fields for a new assessment
    const resetForm = () => {
        setSelectedAssessmentType('');
        setSelectedPatient('');
        setAssessmentDate('');
        setQuestionsAnswers([{ question: '', answer: '' }]);
        setFinalScore('');
    };

    // Effect to populate or reset form fields based on modal state
    useEffect(() => {
        // Populate form fields with data from assessmentToEdit
        const populateFormForEdit = () => {
            if (assessmentToEdit) {
                setSelectedAssessmentType(assessmentToEdit.assessment_type);
                setSelectedPatient(assessmentToEdit.patient);
                setAssessmentDate(assessmentToEdit.assessment_date);
                setQuestionsAnswers(assessmentToEdit.questions_and_answers || [{ question: '', answer: '' }]);
                setFinalScore(assessmentToEdit.final_score);
            }
        };
    
        isCreate ? resetForm() : populateFormForEdit();
    }, [isCreate, assessmentToEdit]);

    // Add a new blank question-answer pair
    const handleAddQuestionAnswer = () => {
        setQuestionsAnswers([...questionsAnswers, { question: '', answer: '' }]);
    };

    // Remove a question-answer pair by index
    const handleRemoveQuestionAnswer = (index) => {
        setQuestionsAnswers(questionsAnswers.filter((_, i) => i !== index));
    };

    // Update a specific question or answer
    const handleQAChange = (index, field, value) => {
        const updatedQuestions = [...questionsAnswers];
        updatedQuestions[index][field] = value;
        setQuestionsAnswers(updatedQuestions);
    };

    // Handle form submission for creating or editing assessments
    const handleSubmit = async (e) => {
        e.preventDefault();
        const assessmentData = {
            assessment_type: selectedAssessmentType,
            patient: selectedPatient,
            assessment_date: assessmentDate,
            questions_and_answers: questionsAnswers,
            final_score: finalScore,
        };
        const token = localStorage.getItem('access_token');
        
        try {
            const url = isCreate 
                ? 'http://localhost:8000/api/assessments/'  // URL for creating a new assessment
                : `http://localhost:8000/api/assessments/${assessmentToEdit.id}/`;  // URL for updating an existing assessment

            const method = isCreate ? 'post' : 'put'; // Determine HTTP method

            await axios({
                method,
                url,
                data: assessmentData,
                headers: { Authorization: `Bearer ${token}` }, // Include authorization token
            });

            onAssessmentChanged(); // Pass updated data to parent component
            onClose(); // Close modal after successful submission
        } catch (error) {
            alert('Failed to save assessment : ', error);
        }
    };

    // Don't render modal if it's not open
    if (!isOpen) return null;

    return (
        <div className="action-modal-overlay">
            <div className="action-modal">
                <h2>{isCreate ? 'Add Assessment' : 'Edit Assessment'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Select Assessment Type */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Assessment Type:</label>
                        <select
                            value={selectedAssessmentType}
                            onChange={(e) => setSelectedAssessmentType(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Select Assessment Type</option>
                            {assessmentTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Select Patient */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Patient:</label>
                        <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>{patient.full_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Assessment Date */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Assessment Date:</label>
                        <input
                            type="date"
                            value={assessmentDate}
                            className="form-control"
                            onChange={(e) => setAssessmentDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Questions and Answers */}
                    <label className="form-label">Questions and Answers:</label>
                    {questionsAnswers.map((qa, index) => (
                        <div key={index} className="question-answer-pair mb-3">
                            <input
                                type="text"
                                placeholder="Question"
                                className="form-control"
                                value={qa.question}
                                onChange={(e) => handleQAChange(index, 'question', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Answer"
                                className="form-control mt-2"
                                value={qa.answer}
                                onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
                                required
                            />
                            <button type="button" className="btn btn-primary mt-2" onClick={() => handleRemoveQuestionAnswer(index)}>Remove</button>
                        </div>
                    ))}

                    {/* Button to Add More Question-Answer Pairs */}
                    <div className="mb-3 mt-3">
                        <button type="button" className="btn btn-primary" onClick={handleAddQuestionAnswer}>Add Question</button>
                    </div>

                    {/* Final Score Input */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Final Score:</label>
                        <input
                            type="number"
                            placeholder="Final Score"
                            className="form-control"
                            value={finalScore}
                            onChange={(e) => setFinalScore(e.target.value)}
                            required
                        />
                    </div>

                    {/* Form Action Buttons */}
                    <div className="form-buttons mb-3 mt-3">
                        <button type="submit" className="btn btn-primary">OK</button>
                        <button type="button" className="btn btn-primary cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssessmentModal;