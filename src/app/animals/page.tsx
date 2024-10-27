"use client";
import React, { useState } from 'react';

export default function Animals(){
    const animalsList: string[] = ['cat', 'dog', 'bird', 'fish', 'hamster', 'rabbit'];
    const [animals, setAnimals] =useState([]);

    const AddAnimal = () => {
        const randomAnimals = Math.floor(Math.random() * animalsList.length);
        setAnimals([...animals, animalsList[randomAnimals]]);
    }
    return(<div>
       <button onClick = {AddAnimal}>Add Animal</button>
       {animals && animals.map((animal, i)=>{
          return <div key={i}>{animal}</div>
       })}
    </div>);
}