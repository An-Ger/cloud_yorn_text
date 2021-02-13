import "./App.css";
import {
  faPlus,
  faFileImport,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TabList from "./components/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import uuidv4 from "uuid";
import { objToArr } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
// const fs = window.require('fs')
// console.dir(fs)
const { join } = window.require("path");
const  {remote}  = window.require("electron")
const Store = window.require("electron-store");
const fileStore = new Store({'name': 'AppData'});
const saveFilesToStore = (files) => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt,
    };
    return result;
  }, {});
  fileStore.set("files", filesStoreObj);
};
function App() {
  const savedLocation = remote.app.getPath("documents");
  const [files, setFiles] = useState(fileStore.get("files") || {});
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFiledIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files);
  const openedFiles = openedFileIDs.map((openID) => {
    return files[openID];
  });
  const activeFile = files[activeFileID];
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }
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
    const newFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: newFile });
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id]);
    }
  };
  const deleteFile = (id) => {
    if(files[id].isNew) {
      delete files[id];
      setFiles(files);
    }
    else {
    fileHelper.deleteFile(files[id].path).then(() => {
      delete files[id];
      setFiles(files);
      saveFilesToStore(files);
      //close the tab if open
      tabClose(id);
    });
  }
  };
  const updateFileName = (id, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`);
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`);
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
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
    };
    setFiles({ ...files, [newID]: newFile });
  };
  const saveCurrentFile = () => {
    fileHelper
      .wirteFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body)
      .then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter((id) => id !== activeFile.id));
      });
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
              <BottomBtn
                text="保存"
                colorClass="btn-success"
                icon={faSave}
                onBtnClick={saveCurrentFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
