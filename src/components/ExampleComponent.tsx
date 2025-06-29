import React from 'react';

interface ExampleComponentProps {
  title: string;
  count: number;
  onIncrement: () => void;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  count,
  onIncrement,
}) => {
  return (
    <div className='p-4 border rounded-lg'>
      <h2 className='text-xl font-bold mb-2'>{title}</h2>
      <p className='text-gray-600 mb-4'>Count: {count}</p>
      <button
        onClick={onIncrement}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Increment
      </button>
    </div>
  );
};

// Enable Why Did You Render for this component
ExampleComponent.whyDidYouRender = true;

export default ExampleComponent;
