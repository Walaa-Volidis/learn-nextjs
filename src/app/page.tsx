"use client";
import React, { useState } from 'react';

export default function Home() {
  const [counter, setCounter] = useState(0);

  const handleIncrement = () => {
    setCounter(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCounter(prev => prev - 1);
  };

  return (
    <div>
      <h1>{counter}</h1>
      <div>
      <button onClick={handleIncrement}>Increment</button>
      </div>
      <div>
      <button onClick={handleDecrement}>Decrement</button>
      </div>
    </div>
  );
}