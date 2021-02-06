import './App.css';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles'
function App() {
  return (
    <div className="App" container-fluid>
      <div className="row">
        <div className="col bg-dark left-panel">
          <FileSearch
          title = "云文档"
          onFileSearch={(value) => {console.log(value);}}
          />
          <FileList
          files={defaultFiles}
          onFileClick ={id => console.log("cc",id)}
          onFileDelete={id => console.log("dd",id)}
          onSaveEdit={(id, value) => {console.log("id:",id, "value:", value)}}
          />
        </div>
        <div className="col bg-primary right-panel">
          <h1>this is the right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
