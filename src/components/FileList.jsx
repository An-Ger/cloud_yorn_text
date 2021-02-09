import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faTasks,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
// import  faMarkdown from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue("");
    if(editItem.isNew) {
      onFileDelete(editItem.id)
    }
  };
  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    console.log(newFile);
    if(newFile) {
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])
  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    if (enterPressed && editStatus && value.trim() !== "") {
      onSaveEdit(editItem.id, value);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editStatus) {
      closeSearch(editItem);
    }
  });
  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => {
        return (
          <li
            className="list-group-item bg-light d-flex align-items-center file-item mx-0"
            key={file.id}
          >
            {(file.id !== editStatus) && !file.isNew && (
              <>
                <span>
                  <FontAwesomeIcon icon={faTasks} size="lg" title="MD" />
                </span>
                <span
                  className="col-6 c-link"
                  onClick={() => {
                    onFileClick(file.id);
                  }}
                >
                  {file.title}
                </span>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    setEditStatus(file.id);
                    setValue(file.title);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} size="lg" title="编辑" />
                </button>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    onFileDelete(file.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" title="删除" />
                </button>
              </>
            )}
            {(file.id === editStatus || file.isNew) && (
              <>
                <input
                  className="form-control col-10"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  placeholder="输入名称"
                />
                <button
                  type="button"
                  className="icon-buttton col-2"
                  onClick={() => {closeSearch(file)}}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    color="red"
                    title="关闭"
                  />
                </button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};
FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
};
export default FileList;
