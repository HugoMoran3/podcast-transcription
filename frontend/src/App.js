import './App.css';
import FileUpload from './components/FileUpload';
import TranscribeFile from './components/TranscribeFile';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <FileUpload />
          <TranscribeFile />
        </p>
      </header>
    </div>
  );
}

export default App;
