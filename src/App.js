import Home from "./components/Home";
import Menu from "./components/Menu/Menu";
import StockList from "./components/StockList";
import History from "./components/History/History";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Menu />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ADD MORE ROUTES WHEN NEEDED */}
          <Route path="/stock" element={<StockList />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
