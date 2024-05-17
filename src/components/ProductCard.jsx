import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

export const ProductCard = ({ product, onAddToCart }) => {
  const addItemToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart();
  };

  return (
    <Link
      to={`/productdetail/${product.id}`}
      className="productcard__container"
      state={{ product }}
    >
      <div className="productcard__product-image">
        <img src={product.image} alt="product" />
      </div>
      <div className="productcard__product-info">
        <p className="productcard__product-price">{product.price} ₺</p>
        <p className="productcard__product-name">{product.name}</p>
      </div>
      <button
        onClick={addItemToCart}
        className="productcard__add-to-cart-button"
      >
        Add to Cart
      </button>
    </Link>
  );
};
