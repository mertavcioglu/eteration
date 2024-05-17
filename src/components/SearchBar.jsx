import "./SearchBar.css";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { NotFoundContent } from "./NotFoundContent";
import axios from "axios";

export const SearchBar = () => {
  let navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const getProducts = async () => {
    const { data: _products } = await axios.get(
      "https://5fc9346b2af77700165ae514.mockapi.io/products"
    );
    setProducts(_products);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const updatedProducts = products?.map((product) => ({
    ...product,
    label: product.name,
    value: product.id,
  }));

  return (
    <div className="searchBar__container">
      <Select
        notFoundContent={<NotFoundContent message="Ürün bulunamadı." />}
        className="searchBar__search"
        showSearch
        open={showOptions}
        placeholder="Search..."
        optionFilterProp="children"
        onSearch={(value) => setShowOptions(value.length > 0)}
        onSelect={(productId, option) => {
          navigate(`/productdetail/${productId}`, {
            state: { product: option },
          });
          setShowOptions(false);
          setSearchValue("");
        }}
        onInputKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearchValue("");
          }
        }}
        onChange={(value) => setSearchValue(value)}
        value={searchValue}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={updatedProducts}
        suffixIcon={""}
      />
      <div className="searchBar__icon">
        <SearchOutlined style={{ fontSize: 20 }} />
      </div>
    </div>
  );
};
