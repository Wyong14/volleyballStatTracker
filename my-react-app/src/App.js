import React, { useState } from 'react';
import './App.css';

function App() {
  const [opponentScore, setOpponentScore] = useState(0);
  const [score, setScore] = useState(0);
  const [numSet, setNumSet] = useState(0);
  const [numOpponentSet, setNumOpponentSet] = useState(0);
  const [title, setTitle] = useState('Spiking Saints VS');
  const [scoringData, setScoringData] = useState({});
  const [selectedOpponentPosition, setSelectedOpponentPosition] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [pointScorer, setPointScorer] = useState('');
  const [pointForSS, setPointForSS] = useState(true);

  const numRows = 2;
  const numCols = 3;

  const renderGrid = (type) => {
    const grid = [];

    let num = 1;

    for (let row = 0; row < numRows; row++) {
      const rowButtons = [];
      for (let col = 0; col < numCols; col++) {
        let position;
        let isSelected;

        if (type === 'SS') {
          position = renderNumber(row, col);
          isSelected = position === selectedPosition
        } else if (type === 'OT') {
          position = renderPosition(row, col);
          isSelected = position === selectedOpponentPosition
        }

        rowButtons.push(
          <button
            key={col}
            className="grid-button"
            onClick={() => type === 'SS' ? setSelectedPosition(position) : setSelectedOpponentPosition(position)}
            style={{
              backgroundColor: isSelected ? 'white' : type === 'SS' ? '#d0f8bd' : type === 'OT' ? '#f5b5b7' : 'black'
            }}
          >
            {position}
          </button>
        );

        num++;
      }
      grid.push(<div key={row} className="grid-row">{rowButtons}</div>);
    }

    return grid;
  };


  const renderNumber = (row, col) => {
    if (row === 0 && col === 0) return 4;
    if (row === 0 && col === numCols - 1) return 2;
    if (row === numRows - 1 && col === 0) return 5;
    if (row === numRows - 1 && col === numCols - 1) return 1;
    if (row === numRows - 1 && col === Math.floor(numCols / 2)) return 6;
    if (row === 0 && col === Math.floor(numCols / 2)) return 3;
  };

  const renderPosition = (row, col) => {
    if (row === 0 && col === 0) return 'BL';
    if (row === 0 && col === numCols - 1) return 'BR';
    if (row === numRows - 1 && col === 0) return 'FL';
    if (row === numRows - 1 && col === numCols - 1) return 'FR';
    if (row === numRows - 1 && col === Math.floor(numCols / 2)) return 'FM';
    if (row === 0 && col === Math.floor(numCols / 2)) return 'BM';
  };

  const handleScoreChange = (pointForSS, scoredBy) => {
    setPointScorer(scoredBy)
    setPointForSS(pointForSS)
  };

  const confirmScoreChange = () => {
    setScore((prevScore) => prevScore + (pointForSS ? 1 : 0));
    setOpponentScore((prevOpponentScore) => prevOpponentScore + (pointForSS ? 0 : 1));

    setScoringData((prevScoringData) => {
      const currentSet = numSet + numOpponentSet + 1;
      let generatedCode; 
      // OTMP 
      if (pointScorer === 'OTMP') {
        generatedCode = `${pointScorer}(${selectedPosition}AF)`
      }

      // OTMS missed serve button 
      else if (selectedPosition === 'MS') {  
        generatedCode = `OTMS (${pointScorer})`
      }
      // OTOP 
      else if (pointScorer === 'OTOP') {
        let mirroredPosition; 
        if (selectedOpponentPosition === 'BL') {
          mirroredPosition = '5M'
        } else if (selectedOpponentPosition === 'BR') {
          mirroredPosition = '1M'
        } else if (selectedOpponentPosition === 'FL') {
          mirroredPosition = '4M'
        } else if (selectedOpponentPosition === 'FR') {
          mirroredPosition = '2M'
        } else if (selectedOpponentPosition === 'FM') {
          mirroredPosition = '3M'
        } else if (selectedOpponentPosition === 'BM') {
          mirroredPosition = '6M'
        }
        generatedCode = `${pointScorer} (${mirroredPosition}/${selectedPosition}DF)`

      }
      // FRMB or OTMB 
      else if (pointScorer === 'FRMB' || pointScorer === 'OTMB') {
        generatedCode = pointScorer
      }
      
      // Friendly Point 
      else {
        // Serve 
        if (selectedPosition === 'SE') {
          generatedCode = `${pointScorer} (SE/${selectedOpponentPosition})`
        }
        // Other 
        else {
          generatedCode = `${pointScorer} (${selectedPosition}A/${selectedOpponentPosition})`
        }
      }

      return {
        ...prevScoringData,
        [currentSet]: [...(prevScoringData[currentSet] || []), generatedCode],
      };
    });


    // Reset current scorer, positions etc. 
    setPointScorer('')
    setPointForSS(pointForSS)
    setSelectedOpponentPosition('')
    setSelectedPosition('')
  }
  // Function to render the scoring data
  const renderScoringData = () => {
    return (
      <div className="scoring-data">
        {Object.keys(scoringData).map((setNumber) => (
          <div style={{ margin: '1vw' }} key={setNumber}>
            <h4>Set {setNumber}:</h4>
            {scoringData[setNumber].map((point, index) => (
              <div key={index}>
                {point}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleEndSet = () => {
    // whichever has a higher current score won the set 
    if (score > opponentScore) { // we won the set 
      setNumSet(numSet + 1)
    } else { // opponent won the set
      setNumOpponentSet(numOpponentSet + 1)
    }

    // Reset the current scores 
    setScore(0)
    setOpponentScore(0)
  }

  const handleServes = (pointForSS) => {
    if (pointForSS) { // service point
      setSelectedPosition('SE')
      setPointForSS(true)
    } else { // Missed Serve
      setSelectedPosition('MS')
      setPointForSS(false)
    }
  }
  return (
    <div className="App">
      <div className="Scoring">
        <input
          type="text"
          className='scoring-title'
          style={{ width: '90%', fontWeight: 'bold', margin: '2vw', caretColor: 'black' }}
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
          <button className='scoring-button' onClick={() => handleEndSet()} style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>END SET</button>
          <button className='scoring-button' style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>END MATCH</button>
        </div>
        <div className="current-score">
          <h2 className='scoring-title'>Current Score :</h2>
          <h2 id='score' className='scoring-title'>
            <span style={{ color: '#dff6c5' }}>[{score}]</span> |
            <span style={{ color: '#f4acac' }}> [{opponentScore}]</span>
          </h2>
          <h2 className='scoring-title'>Sets :</h2>
          <h2 id='sets' className='scoring-title'>
            <span style={{ color: '#dff6c5' }}>[{numSet}]</span> |
            <span style={{ color: '#f4acac' }}> [{numOpponentSet}]</span>
          </h2>
        </div>
        <h2 className='scoring-title'>Confirm Point Details:</h2>
        <div>Point Scorer: {pointScorer}</div>
        <div>Point for Spiking Saints? {pointForSS ? 'Yes' : 'No'}</div>
        <div>Currently Selected Position: {selectedPosition}</div>
        <div>Currently Selected Opponent Position: {selectedOpponentPosition}</div>
        {/* <div>Generated Code:
          {pointForSS ? (
            CONCAT THE DATA OWEN WANTS 
          ) : (
            REVERSE THE ORDER?
          )}
        </div> */}
        <button className='scoring-button' onClick={() => confirmScoreChange()} style={{ backgroundColor: '#6fff79', width: 'auto', fontSize: '2rem' }}>CONFIRM</button>
        {/* Render the scoring data */}
        {renderScoringData()}
      </div>
      <div className="App-header">
        <h3>Other Team</h3>
        {renderGrid('OT')}
        <h3>-----Net-----</h3>
        {renderGrid('SS')}
        <h3>Spiking Saints</h3>
        {/* SERVES */}
        <div style={{display: 'flex'}}>
          <button className='scoring-button' onClick={() => handleServes(true)} style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>SE</button>
          <button className='scoring-button' onClick={() => handleServes(false)} style={{ backgroundColor: 'white', width: 'auto', fontSize: '2rem' }}>MS</button>
        </div>
      </div>
    </div >
  );
}

export default App;
