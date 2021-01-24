import React, {
  MouseEvent,
  WheelEvent,
  RefObject,
  useRef,
  useState,
} from "react";
import "./nav.css";
import tabSlice, { Tabs } from "../../reducers/tabs";
import { useDispatch } from "react-redux";

function generateUI(tabs: Tabs, current: number, click, closeClick) {
  function isActive(active: boolean) {
    return active ? "active" : "";
  }

  return tabs.map((it) => (
    <li
      key={it.id}
      onClick={(ev) => click(ev, it.id)}
      className={
        "nav__item flex whitespace-nowrap select-none active:bg-blue-300 text-center  px-2 bg-blue-400 shadow-xl cursor-pointer " +
        isActive(current === it.id)
      }
    >
      <div className="justify-self-center">{it.title}</div>
      <div
        className="justify-self-end px-3 text-red-600 text-lg font-bold self-center"
        onClick={(ev) => closeClick(ev, it.id)}
      >
        X
      </div>
    </li>
  ));
}

interface Props {
  tabs: Tabs
}

function Nav(props: Props) {
  const navContainer: RefObject<HTMLUListElement> = useRef(null);
  const tabs = props.tabs;
  const dispatch = useDispatch();
  const newTabAction = tabSlice.actions.new;
  const removeTabAction = tabSlice.actions.remove;
  const [current, setCurrent] = useState(tabs[0].id);

  function click(ev: MouseEvent<HTMLLIElement>, id: number) {
    setCurrent(id);
  }

  function closeHandler(ev: MouseEvent, id: number) {
    ev.stopPropagation();
    if (tabs.length <= 1) return;
    dispatch(removeTabAction(id));
  }

  function newTab() {
    dispatch(newTabAction());
  }

  function scrollHelper(ev: WheelEvent<HTMLUListElement>) {
    const delta = ev.deltaY;
    if (!navContainer.current) return;
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
        {generateUI(tabs, current, click, closeHandler)}
      </ul>
      <button
        className="font-bold text-2xl ml-3 px-6 bg-blue-400"
        onClick={newTab}
      >
        +
      </button>
    </div>
  );
}

export default Nav;
