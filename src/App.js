import "./App.css";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import BottomBtn from "./components/BottomBtn";
import TabList from "./components/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import uuidv4 from "uuid";
import {flattenArr, objToArr} from './utils/helper'
function App() {
  const [files, setFiles] = useState(flattenArr(defaultFiles));
  console.log(files)
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFiledIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files)
  console.log(filesArr)
  const openedFiles = openedFileIDs.map((openID) => {
    return files[openID]
  });
  const activeFile = files[activeFileID]
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFiledIDs([...openedFileIDs, fileID]);
    }
  };
  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };
  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFiledIDs(tabsWithout);
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID("");
    }
  };
  const fileChange = (id, value) => {
    const newFile = {...files[id], body: value}
    setFiles({...files, [id]: newFile})
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id]);
    }
  };
  const deleteFile = (id) => {
    delete files[id]
    setFiles(files);
    //close the tab if open
    tabClose(id);
  };
  const updateFileName = (id, title) => {
    const modifiedFile = {...files[id], title, isNew:false}
    setFiles({...files, [id]: modifiedFile});
  };
  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  }; 
  const createNewFile = () => {
    const newID = uuidv4();
    const newFile = {
        id: newID,
        title: "",
        body: "## 请输入MarkDown",
        createdAt: new Date().getTime(),
        isNew: true,
    }
    setFiles({...files, [newID]: newFile});
  };
  return (
    <div className="App" container-fluid px-0>
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch title="云文档" onFileSearch={fileSearch} />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9  right-panel">
          {!activeFile && (
            <div className="start-page">选择或者创建新的MarkDown</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {
                  fileChange(activeFile.id, value);
                }}
                options={{
                  minHeight: "515px",
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
