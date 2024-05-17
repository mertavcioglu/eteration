import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/productdetail/:productId"
            element={<ProductDetail />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
