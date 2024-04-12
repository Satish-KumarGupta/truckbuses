import React from 'react';
import Button from './button';

const CustomConfirmation = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-900  overflow-auto px-4 py-6 sm:px-0 flex flex-col justify-center ">
      <h2 className='text-2xl text-red-600 mb-10 text-center'>{message}</h2>
    <div className='flex justify-center gap-10 '>
      <Button onClick={onCancel} text="Cancel" styles="w-1/6 bg-red-400 p-5 hover:bg-red-600 "></Button>
      <Button onClick={onConfirm} text="Confirm" styles="w-1/6 bg-green-500 hover:bg-green-600"></Button>
    </div>  
    </div>
  );
};

export default CustomConfirmation;