import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import "./Home.css";
import axios from "axios";
import { Pagination, Spin } from "antd";
import { useCart } from "../context/CartContext";
import { LoadingOutlined, CheckOutlined } from "@ant-design/icons";

export const Home = () => {
  const { setCartItems, cartItems } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [shownProducts, setShownProducts] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const [checkoutState, setCheckoutState] = useState({
    loading: false,
    success: false,
  });

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

  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  useEffect(() => {
    setShownProducts(
      allProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [allProducts, currentPage]);

  const addItemToCart = (product) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === product.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    if (!cartItems.find((item) => item.id === product.id)) {
      updatedCartItems.push({ ...product, quantity: 1 });
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

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    getAllBrands();
    getAllModels();
  }, [allProducts]);

  const getAllProducts = async () => {
    const { data: _products } = await axios.get(
      "https://5fc9346b2af77700165ae514.mockapi.io/products"
    );
    setAllProducts(_products);
  };

  const getAllBrands = () => {
    const uniqueBrands = [];
    for (const product of allProducts) {
      if (!uniqueBrands.includes(product.brand)) {
        uniqueBrands.push(product.brand);
      }
    }
    setAllBrands(uniqueBrands);
  };

  const getAllModels = () => {
    const uniqueModels = [];
    for (const product of allProducts) {
      if (!uniqueModels.includes(product.model)) {
        uniqueModels.push(product.model);
      }
    }
    setAllModels(uniqueModels);
  };
  const toggleBrandSelection = (brand) => {
    setCurrentPage(1);

    const isSelected = selectedBrands.includes(brand);
    if (isSelected) {
      setSelectedBrands(
        selectedBrands.filter((selectedBrand) => selectedBrand !== brand)
      );
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleModelSelection = (model) => {
    setCurrentPage(1);

    const isSelected = selectedModels.includes(model);
    if (isSelected) {
      setSelectedModels(
        selectedModels.filter((selectedModel) => selectedModel !== model)
      );
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  useEffect(() => {
    const filteredProducts = allProducts.filter((product) => {
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const modelMatch =
        selectedModels.length === 0 || selectedModels.includes(product.model);
      return brandMatch && modelMatch;
    });
    setShownProducts(
      filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [allProducts, currentPage, selectedBrands, selectedModels]);

  return (
    <div className="outer__container">
      <div className="home__content">
        <div className="home__left">
          <div className="home__filter-container">
            <p className="home__filter-text">Sort By</p>
            <div className="home__filter-box">
              <div
                className="home__filter-box-item"
                onClick={() => {
                  setShownProducts(
                    [...shownProducts].sort(
                      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    )
                  );
                }}
              >
                <input type="radio" name="sort" id="sort4" defaultChecked />
                <label htmlFor="sort4">Old to New</label>
              </div>
              <div
                className="home__filter-box-item"
                onClick={() => {
                  setShownProducts(
                    [...shownProducts].sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                  );
                }}
              >
                <input type="radio" name="sort" id="sort3" />
                <label htmlFor="sort3">New to Old</label>
              </div>
              <div
                className="home__filter-box-item"
                onClick={() => {
                  setShownProducts(
                    [...shownProducts].sort((a, b) => b.price - a.price)
                  );
                }}
              >
                <input type="radio" name="sort" id="sort2" />
                <label htmlFor="sort2">Price High to Low</label>
              </div>
              <div
                className="home__filter-box-item"
                onClick={() => {
                  setShownProducts(
                    [...shownProducts].sort((a, b) => a.price - b.price)
                  );
                }}
              >
                <input type="radio" name="sort" id="sort1" />
                <label htmlFor="sort1">Price Low to High</label>
              </div>
            </div>
          </div>
          <div className="home__filter-container">
            <p className="home__filter-text">Brands</p>
            <div className="home__filter-box">
              <div className="home__filter-search">
                <input
                  type="text"
                  className="home__filter-search-input"
                  placeholder="Search Brand"
                  onChange={(e) => {
                    const filteredBrands = allBrands.filter((brand) =>
                      brand.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setAllBrands(filteredBrands);
                    if (e.target.value === "") {
                      getAllBrands();
                    }
                  }}
                />
              </div>
              <div className="home__filter-list">
                {allBrands.map((brand) => (
                  <div
                    onClick={() => toggleBrandSelection(brand)}
                    className="home__filter-box-item"
                    key={brand}
                  >
                    <input
                      type="checkbox"
                      name="brand"
                      checked={selectedBrands.includes(brand)}
                    />
                    <label htmlFor="brand">{brand}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="home__filter-container">
            <p className="home__filter-text">Model</p>
            <div className="home__filter-box">
              <div className="home__filter-search">
                <input
                  type="text"
                  className="home__filter-search-input"
                  placeholder="Search Model"
                  onChange={(e) => {
                    const filteredModels = allModels.filter((model) =>
                      model.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setAllModels(filteredModels);
                    if (e.target.value === "") {
                      getAllModels();
                    }
                  }}
                />
              </div>
              <div className="home__filter-list">
                {allModels.map((model) => (
                  <div
                    onClick={() => toggleModelSelection(model)}
                    className="home__filter-box-item"
                    key={model}
                  >
                    <input
                      type="checkbox"
                      name="model"
                      checked={selectedModels.includes(model)}
                    />
                    <label htmlFor="model">{model}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <button
              className="home__filter-clear"
              onClick={() => {
                setSelectedBrands([]);
                setSelectedModels([]);
                setCurrentPage(1);
                document
                  .querySelectorAll(".home__filter-search-input")
                  .forEach(function (input) {
                    input.value = "";
                  });
                document.querySelector(".home__filter-search-input").value = "";
                getAllBrands();
                getAllModels();
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
        <div className="home__middle">
          <div className="home__middle-productcards-container">
            {shownProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addItemToCart(product)}
              />
            ))}
          </div>
          <Pagination
            className="home__pagination"
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            total={
              allProducts.filter((product) => {
                const brandMatch =
                  selectedBrands.length === 0 ||
                  selectedBrands.includes(product.brand);
                const modelMatch =
                  selectedModels.length === 0 ||
                  selectedModels.includes(product.model);
                return brandMatch && modelMatch;
              }).length
            }
            pageSize={productsPerPage}
          />
        </div>
        <div className="home__right">
          <div className="home__filter-container">
            <p className="home__filter-text">Cart</p>
            <div className="home__checkout-box">
              <div className="home__cart-item-container">
                {cartItems?.length > 0 ? (
                  cartItems
                    ?.filter((product) => product.quantity > 0)
                    .map((product) => (
                      <div className="home__cart-item" key={product.id}>
                        <div className="home__cart-item-info">
                          <p className="home__cart-item-name">{product.name}</p>
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
                          <button onClick={() => addItemToCart(product)}>
                            +
                          </button>
                        </div>
                      </div>
                    ))
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
                Total Price:{" "}
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
