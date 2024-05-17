import "./Header.css";
import { SearchBar } from "../components/SearchBar";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";

export const Header = () => {
  const { cartItems } = useCart();

  return (
    <div className="header__container">
      <div className="header__left">
        <div className="header__left-text-container">
          <p
            className="header__left-text"
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/";
              }
            }}
          >
            Eteration
          </p>
        </div>
        <div className="header__left-search-container">
          <SearchBar />
        </div>
      </div>
      <div className="header__right">
        <div className="header__right-empty"></div>
        <div className="header__right-info-container">
          <div className="header__right-info">
            <p className="header__right-info-icon">
              <ShoppingOutlined />
            </p>
            <p className="header__right-info-text">
              {cartItems
                .reduce(
                  (total, item) =>
                    total + parseFloat(item.price) * item.quantity,
                  0
                )
                .toFixed(0)}{" "}
              ₺
            </p>
          </div>
          <div className="header__right-info">
            <p className="header__right-info-icon">
              <UserOutlined />
            </p>
            <p className="header__right-info-text">Mert Avcıoğlu</p>
          </div>
        </div>
      </div>
    </div>
  );
};
