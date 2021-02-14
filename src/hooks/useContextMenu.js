import { useEffect, useRef } from "react";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;
const useContextMenu = (item, targetSelector, deps) => {
  let clickedElement = useRef(null);
  useEffect(() => {
    const menu = new Menu();
    item.forEach((element) => {
      menu.append(new MenuItem(element));
    });
    const handleContextMenu = (e) => {
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target;
        menu.popup({ window: remote.getCurrentWindow() });
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, deps);
  return clickedElement;
};
export default useContextMenu;
