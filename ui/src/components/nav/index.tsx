import React, {
  MouseEvent,
  WheelEvent,
  RefObject,
  useRef,
  useState,
} from "react";
import "./style.css";
import tabSlice, { Tabs } from "../../reducers/tabs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";

function useGenerateUI(tabs: Tabs, current: number) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const renameAction = tabSlice.actions.rename;
  const removeTabAction = tabSlice.actions.remove;
  const changeCurrentAction = tabSlice.actions.changeCurrent;

  function isActive(active: boolean) {
    return active ? "active" : "";
  }

  function setCurrent(id: number) {
    dispatch(changeCurrentAction(id));
  }

  function closeClick(ev: MouseEvent, id: number) {
    ev.stopPropagation();
    if (tabs.length <= 1) return;
    if (id === current) {
      const idx = tabs.findIndex(it => it.id === id);
      let newIdx = 0;
      if (idx === -1) return;
      if (idx === 0) newIdx = 1;
      else newIdx = idx - 1;
      setCurrent(tabs[newIdx].id);
    }
    dispatch(removeTabAction(id));
  }

  function click(id: number) {
    setCurrent(id);
  }

  function doubleClick() {
    setIsEditing(true);
  }

  function submitRenaming(id: number, value: string) {
    if (value.length !== 0) {
      dispatch(renameAction({ id, title: value }));
    }
    setIsEditing(false);
  }

  return tabs.map((it) => (
    <li
      key={it.id}
      onClick={() => click(it.id)}
      className={
        "nav__item flex whitespace-nowrap select-none active:bg-blue-300 text-center  px-2 bg-blue-400 shadow-xl cursor-pointer " +
        isActive(current === it.id)
      }
    >
      {
        isEditing && it.id === current ?
          <input className="justify-self-center" defaultValue={it.title} autoFocus
                 onBlur={(ev) => submitRenaming(it.id, ev.currentTarget.value)}
                 onKeyPress={(ev) => {
                   if (ev.key === "Enter") {
                     submitRenaming(it.id, ev.currentTarget.value);
                   }
                 }}
          />
          :
          <div className="justify-self-center"
               onDoubleClick={() => doubleClick()}
          >{it.title}</div>

      }
      <div
        className="justify-self-end px-3 text-red-600 text-lg font-bold self-center"
        onClick={(ev) => closeClick(ev, it.id)}
      >
        X
      </div>
    </li>
  ));
}


function Index() {
  const navContainer: RefObject<HTMLUListElement> = useRef(null);
  const tabs = useSelector<RootState>(state => state.tabReducer.tabs) as Tabs;
  const current = useSelector<RootState>(state => state.tabReducer.current) as number;
  const dispatch = useDispatch();
  const newTabAction = tabSlice.actions.new;

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
        {useGenerateUI(tabs, current)}
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

export default Index;
