import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [opponentScore, setOpponentScore] = useState(0);
  const [score, setScore] = useState(0);
  const [numSet, setNumSet] = useState(0);
  const [numOpponentSet, setNumOpponentSet] = useState(0);
  const [title, setTitle] = useState('Spiking Saints VS');
  const [scoringData, setScoringData] = useState({});
  const numRows = 2;
  const numCols = 3;

  const renderGrid = () => {
    const grid = [];

    let num = 1;

    for (let row = 0; row < numRows; row++) {
      const rowButtons = [];
      for (let col = 0; col < numCols; col++) {
        const number = renderNumber(row, col, num);
        rowButtons.push(
          <button
            key={col}
            className="grid-button"
          >
            {number}
          </button>
        );
        num++;
      }
      grid.push(<div key={row} className="grid-row">{rowButtons}</div>);
    }

    return grid;
  };

  const renderNumber = (row, col, number) => {
    if (row === 0 && col === 0) return 4;
    if (row === 0 && col === numCols - 1) return 2;
    if (row === numRows - 1 && col === 0) return 5;
    if (row === numRows - 1 && col === numCols - 1) return 1;
    if (row === numRows - 1 && col === Math.floor(numCols / 2)) return 6;
    if (row === 0 && col === Math.floor(numCols / 2)) return 3;
    return number;
  };

  const handleScoreChange = (scoredBySS, scoredBy, number) => {
    setScore((prevScore) => prevScore + (scoredBySS ? 1 : 0));
    setOpponentScore((prevOpponentScore) => prevOpponentScore + (scoredBySS ? 0 : 1));

    setScoringData((prevScoringData) => {
      const currentSet = numSet + numOpponentSet + 1;

      return {
        ...prevScoringData,
        [currentSet]: [...(prevScoringData[currentSet] || []), scoredBy],
      };
    });
  };

  useEffect(() => {
    console.log(scoringData);
  }, [scoringData]);

  // Function to render the scoring data
  const renderScoringData = () => {
    return (
      <div className="scoring-data">
        {Object.keys(scoringData).map((setNumber) => (
          <div key={setNumber}>
            <h4>Set {setNumber}:</h4>
            {scoringData[setNumber].map((point, index) => (
              <div key={index}>
                {index + 1}: {point}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="Scoring">
        <input
          type="text"
          className='scoring-title'
          style={{ width: '90%', fontWeight: 'bold', margin: '2vw', caretColor: 'black'}}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'TS')} style={{ backgroundColor: '#b7e1cd' }}>TS</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'PS')} style={{ backgroundColor: '#c9fcff' }}>PS</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'JL')} style={{ backgroundColor: '#e8ffc9' }}>JL</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'JJ')} style={{ backgroundColor: '#6fff79' }}>JJ</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'WS')} style={{ backgroundColor: '#d9baff' }}>WS</button>
        </div>
        <div>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'KZ')} style={{ backgroundColor: '#fcd5eb' }}>KZ</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'ER')} style={{ backgroundColor: '#eacd87' }}>ER</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'MX')} style={{ backgroundColor: '#b0bb15' }}>MX</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'TE')} style={{ backgroundColor: '#fef842' }}>TE</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'UE')} style={{ backgroundColor: '#ff8f57' }}>UE</button>
        </div>
        <div>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(true, 'FRMB')} style={{ backgroundColor: '#e1ffe9', width: 'auto' }}>FRMB</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(false, 'OTOP')} style={{ backgroundColor: '#ffadad', width: 'auto' }}>OTOP</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(false, 'OTMP')} style={{ backgroundColor: '#ffadad', width: 'auto' }}>OTMP</button>
          <button className='scoring-button scoring-title' onClick={() => handleScoreChange(false, 'OTMB')} style={{ backgroundColor: '#ffadad', width: 'auto' }}>OTMB</button>
        </div>
        <div>
          <button className='scoring-button' style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>REVIEW</button>
          <button className='scoring-button' style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>END SET</button>
          <button className='scoring-button' style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>END MATCH</button>
        </div>
        <div className="current-score">
          <h2 className='scoring-title'>Current Score :</h2>
          <h2 id='score' className='scoring-title'>[{score}] | [{opponentScore}]</h2>
          <h2 className='scoring-title'>Sets :</h2>
          <h2 id='sets' className='scoring-title'>[{numSet}] | [{numOpponentSet}]</h2>
        </div>
        {/* Render the scoring data */}
        {renderScoringData()}
      </div>
      <div className="App-header">
        <h3>Other Team</h3>
        {renderGrid()}
        <h3>-----Net-----</h3>
        {renderGrid()}
        <h3>Spiking Saints</h3>
      </div>
    </div >
  );
}

export default App;
