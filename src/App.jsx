import { useState, useEffect } from 'react'
import './App.css'

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentItem, setCurrentItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchRandomItem = async () => {
    
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?api_key=${ACCESS_KEY}`);
    const data = await response.json();

    // Access the first item in the array
    const item = data[0];

    // Check if the item has breeds and is not banned
    const hasBreeds = item.breeds && item.breeds.length > 0;
    const isBanned = banList.some(ban => 
      item.breeds.some(breed => 
        breed.name === ban || breed.origin === ban || breed.life_span === ban
      )
    );

    if (isBanned || !hasBreeds) {
      fetchRandomItem(); // Fetch another item if banned
    } else {
      setCurrentItem(item);
      setHistory(prevHistory => [...prevHistory, item]);
    }
  };

  const handleBan = (attribute) => {
    setBanList(prevBanList => [...prevBanList, attribute]);
  };

  return (
    <div className="app">
      <h1>Cats. It's really that simple.</h1>
      <button onClick={fetchRandomItem}>Gimme a Cat</button>
      <div className="container">
        <div className="section history">
          <h2>History</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <img src={item.url} alt="Cat History" />
              </li>
            ))}
          </ul>
        </div>
        <div className="section center-section">
          <h2>Le Cat:</h2>
          {currentItem && (
            <div className="item">
              <img src={currentItem.url} alt="Random Cat" />
              <div className="breeds">
                {currentItem.breeds.map((breed, index) => (
                  <div key={index} className="breed-info">
                    <button onClick={() => handleBan(breed.name)}>
                      Ban {breed.name}
                    </button>
                    <button onClick={() => handleBan(breed.origin)}>
                      Ban {breed.origin}
                    </button>
                    <button onClick={() => handleBan(breed.life_span)}>
                      Ban {breed.life_span} years
                    </button>
                    <p>Breed: {breed.name}</p>
                    <p>Origin: {breed.origin}</p>
                    <p>Life Span: {breed.life_span} years</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="section ban-list">
          <h2>Ban List</h2>
          <ul>
            {banList.map((ban, index) => (
              <li key={index}>{ban}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App
