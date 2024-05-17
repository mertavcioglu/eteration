import { ExclamationCircleOutlined } from "@ant-design/icons";

export const NotFoundContent = ({ message }) => (
  <div style={{ textAlign: "center", padding: 10 }}>
    <ExclamationCircleOutlined
      style={{
        fontSize: 36,
        textAlign: "center",
        color: "#000",
        marginBottom: 10,
        opacity: 0.75,
      }}
    />
    <p style={{ color: "#000" }}>{message}</p>
  </div>
);
