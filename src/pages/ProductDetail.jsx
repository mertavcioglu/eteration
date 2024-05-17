import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import { Spin } from "antd";
import { LoadingOutlined, CheckOutlined } from "@ant-design/icons";

export const ProductDetail = () => {
  let { state } = useLocation();
  const { setCartItems, cartItems } = useCart();
  const [shownProduct, setshownProduct] = useState(null);
  const [checkoutState, setCheckoutState] = useState({
    loading: false,
    success: false,
  });

  useEffect(() => {
    if (state) {
      setshownProduct(state.product);
    }
  }, [state]);

  const toggleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    setCheckoutState({ loading: true, success: false });
    setTimeout(() => {
      setCheckoutState({ loading: false, success: true });
      setCartItems([]);
      setTimeout(() => {
        setCheckoutState({ ...checkoutState, success: false });
      }, 1500);
    }, 1500);
  };

  const addItemToCart = () => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === shownProduct.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    if (!cartItems.find((item) => item.id === shownProduct.id)) {
      updatedCartItems.push({ ...shownProduct, quantity: 1 });
    }

    setCartItems(updatedCartItems);
  };

  const removeItemFromCart = (productId) => {
    const updatedCartItems = cartItems
      .map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCartItems);
  };

  return (
    <div className="outer__container">
      <div className="productdetail__content">
        <div className="productdetail__left">
          <div className="productdetal__card">
            <div className="productdetail__card-left">
              <img
                src={shownProduct?.image}
                alt="Product"
                className="productdetail__card-image"
              />
            </div>
            <div className="productdetail__card-right">
              <div className="productdetail__card-info">
                <p className="productdetail__card-name">
                  {shownProduct?.name}
                  <span>
                    <button
                      onClick={() => {
                        // window.history.back();
                        // Art arda ürün aradğında geri tuşu önceki sayfaya gidiyor, bu yüzden window.location.href kullanıldı.
                        window.location.href = "/";
                      }}
                    >
                      <ArrowLeftOutlined />
                    </button>
                  </span>
                </p>
                <p className="productdetail__card-price">
                  {shownProduct?.price.toLocaleString("tr-TR")} ₺
                </p>
              </div>
              <div className="productdetail__card-bottom">
                <button onClick={addItemToCart} className="home__checkout">
                  Add to Cart
                </button>
                <p className="productdetail__card-description">
                  {shownProduct?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="home__right">
          <div className="home__filter-container">
            <p className="home__filter-text">Cart</p>
            <div className="home__checkout-box">
              <div className="home__cart-item-container">
                {cartItems?.length > 0 ? (
                  cartItems.every((item) => item.quantity <= 0) ? (
                    <div>No Items</div>
                  ) : (
                    cartItems
                      .filter((product) => product.quantity > 0)
                      .map((product) => (
                        <div className="home__cart-item" key={product.id}>
                          <div className="home__cart-item-info">
                            <p className="home__cart-item-name">
                              {product.name}
                            </p>
                            <p className="home__cart-item-price">
                              {product.price.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                          <div className="home__cart-item-quantity">
                            <button
                              onClick={() => removeItemFromCart(product.id)}
                            >
                              -
                            </button>
                            <p>{product.quantity}</p>
                            <button onClick={() => addItemToCart(product.id)}>
                              +
                            </button>
                          </div>
                        </div>
                      ))
                  )
                ) : (
                  <div>No Items</div>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              className="home__filter-clear"
              onClick={() => {
                setCartItems([]);
              }}
            >
              Clear Cart
            </button>
          </div>
          <div className="home__filter-container">
            <p className="home__filter-text">Checkout</p>
            <div className="home__checkout-box">
              <p className="home_total-price">
                Total Price: {""}
                <span>
                  {cartItems
                    .reduce(
                      (total, item) =>
                        total + parseFloat(item.price) * item.quantity,
                      0
                    )
                    .toFixed(0)}{" "}
                  ₺
                </span>
              </p>
              <button
                onClick={toggleCheckout}
                className="home__checkout"
                style={{
                  backgroundColor: checkoutState.success ? "green" : "#2a59fe",
                }}
              >
                {checkoutState.loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 24, color: "white" }}
                        spin
                      />
                    }
                  />
                ) : checkoutState.success ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <p>Order Taken</p>
                    <CheckOutlined />
                  </div>
                ) : (
                  "Checkout"
                )}
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
