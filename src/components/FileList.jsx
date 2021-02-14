import React, { useState, useEffect } from "react";
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
import useContextMenu from "../hooks/useContextMenu";
import { getParentNode } from "../utils/helper";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue("");
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };
  const clickedItem = useContextMenu(
    [
      {
        label: "Open",
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item')
          if(parentElement) {
          onFileClick(parentElement.dataset.id)
          }
        },
      },
      {
        label: "Rename",
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item')
          console.log(parentElement.dataset)
          if(parentElement) {
          onSaveEdit(parentElement.dataset.id,parentElement.dataset.title)
          }
        },
      },
      {
        label: "Delete",
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item')
          if(parentElement) {
          onFileDelete(parentElement.dataset.id)
          }
        },
      },
    ],
    ".file-list", [files]
  );
  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);
  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    if (enterPressed && editStatus && value.trim() !== "") {
      onSaveEdit(editItem.id, value, editItem.isNew);
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
            data-id={file.id}
            data-title={file.title}
          >
            {file.id !== editStatus && !file.isNew && (
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
                  {/* <FontAwesomeIcon icon={faEdit} size="lg" title="编辑" /> */}
                </button>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    onFileDelete(file.id);
                  }}
                >
                  {/* <FontAwesomeIcon icon={faTrash} size="lg" title="删除" /> */}
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
                  onClick={() => {
                    closeSearch(file);
                  }}
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
