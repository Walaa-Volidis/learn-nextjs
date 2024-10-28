"use client";
import React, { useState } from "react";

const animalsList = ["cat", "dog", "bird", "fish", "hamster", "rabbit"];

export default function Animals() {
  const [animals, setAnimals] = useState([""]);

  const addAnimal = () => {
    const randomAnimal = Math.floor(Math.random() * animalsList.length);
    setAnimals((prev) => [...animals, animalsList[randomAnimal]]);
  };
  return (
    <div>
      <button onClick={addAnimal}>Add Animal</button>
      {animals.length > 0 &&
        animals.map((animal, i) => {
          return <div key={i}>{animal}</div>;
        })}
    </div>
  );
}
