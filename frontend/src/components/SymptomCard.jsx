import React from 'react';
import './SymptomCard.css';

const SymptomCard = ({
  symptom,
  description,
  severity,
  triggers,
  remedies,
  duration,
  isHighlighted
}) => {
  const severityClass = {
    Mild: 'card--mild',
    Moderate: 'card--moderate',
    Severe: 'card--severe',
  }[severity] || '';

  return (
    <div className={`symptom-card ${severityClass} ${isHighlighted ? 'highlighted' : ''}`}>
      <h3>{symptom}</h3>
      {description && <p>{description}</p>}
      {triggers?.length > 0 && (
        <p><strong>Triggers:</strong> {triggers.join(', ')}</p>
      )}
      {duration && (
        <p><strong>Duration:</strong> {duration}</p>
      )}
      <p><strong>Severity:</strong> {severity}</p>
      {remedies?.length > 0 && (
        <p><strong>Remedies:</strong> {remedies.join(', ')}</p>
      )}
    </div>
  );
};

export default SymptomCard;
