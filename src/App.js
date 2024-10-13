import React from 'react';
import './App.css';
import ProfileScanner from './ProfileScanner';
import serverforprofilescanner from '../functions/server';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <ProfileScanner />
                <serverforprofilescanner />
            </header>
        </div>
    );
}

export default App;