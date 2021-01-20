import React, { useRef, useState } from "react";
import "./nav.css";

function generateUI(tabs, click) {
  return tabs.map((it) => (
    <li
      key={it.id}
      onClick={click}
      className="nav__item whitespace-nowrap inline-block select-none active:bg-blue-300 text-center  px-2 bg-blue-400 shadow-xl cursor-pointer "
    >
      {it.name}
    </li>
  ));
}

function Nav() {
  const navContainer = useRef();
  const [tabs, setTabs] = useState([{ id: Date.now(), name: "hello" }]);

  function click(ev) {
    console.log(ev.target.key);
  }

  function newTab() {
    setTabs([...tabs, { id: Date.now(), name: "new tab" }]);
  }

  function scrollHelper(ev) {
    const delta = ev.deltaY;
    if (delta < 0) {
      navContainer.current.scrollLeft += delta * 10;
    } else {
      navContainer.current.scrollLeft += delta * 10;
    }
  }

  return (
    <div className="flex">
      <ul
        onWheel={scrollHelper}
        className="nav__container relative flex gap-1 overflow-scroll"
        ref={navContainer}
      >
        {generateUI(tabs, click)}
      </ul>
      <button
        className="font-bold text-2xl ml-3 px-3 bg-blue-400"
        onClick={newTab}
      >
        +
      </button>
    </div>
  );
}

export default Nav;
