"use client";
import React, { useState } from 'react';

export default function Home() {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <h1>{counter}</h1>
      <div>
      <button onClick={()=> setCounter(prev => prev + 1)}>Increment</button>
      </div>
      <div>
      <button onClick={()=> setCounter(prev => prev - 1)}>Decrement</button>
      </div>
    </div>
  );
}