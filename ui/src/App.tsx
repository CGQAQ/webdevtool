import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "./reducers";
import Nav from "./components/nav/nav";

function App() {
  const tabs = useSelector((state: RootState) => state.tabReducer);
  return (
    <div className="App px-3">
      <Nav tabs={tabs} />
    </div>
  );
}

export default App;