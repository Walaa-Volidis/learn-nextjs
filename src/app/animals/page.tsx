"use client";
import React, { useEffect, useState } from "react";

const animalsList = ["cat", "dog", "bird", "fish", "hamster", "rabbit"];

export default function Animals() {
  const [animals, setAnimals] = useState<string[]>([]);

  useEffect(() => {
    const storedAnimals = localStorage.getItem("animals");
    if (storedAnimals) {
      setAnimals(JSON.parse(storedAnimals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("animals", JSON.stringify(animals));
  }, [animals]);
  const addAnimal = () => {
    const randomAnimal = Math.floor(Math.random() * animalsList.length);
    setAnimals((prev) => [...prev, animalsList[randomAnimal]]);
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
