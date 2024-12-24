import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return <div style={{ color: 'red' }}>{message}</div>;
};

export default ErrorMessage;
