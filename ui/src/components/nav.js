import React, { useState } from "react";

function generateUI(tabs) {
  return tabs.map((it) => (
    <li className="inline-block active:bg-blue-300 flex-grow flex-shrink text-center min-w-max max-w-2xs px-2 py-1 bg-blue-400 shadow-xl cursor-pointer ">
      {it.name}
    </li>
  ));
}

function Nav() {
  const [tabs, setTabs] = useState([
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
  ]);

  return (
    <div className="flex">
      <ul className="flex flex-row gap-1">{generateUI(tabs)}</ul>
      <button className="font-bold text-2xl ml-3 px-3 bg-blue-400">+</button>
    </div>
  );
}

export default Nav;
