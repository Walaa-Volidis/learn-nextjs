"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const storedCounter = localStorage.getItem("counter");
    if (storedCounter) {
      setCounter(parseInt(storedCounter));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("counter", counter.toString());
  }, [counter]);
  return (
    <div>
      <h1>{counter}</h1>
      <div>
        <button onClick={() => setCounter((prev) => prev + 1)}>
          Increment
        </button>
      </div>
      <div>
        <button onClick={() => setCounter((prev) => prev - 1)}>
          Decrement
        </button>
      </div>
    </div>
  );
}
