import { useState, useEffect, CSSProperties } from "react";
import { FiRefreshCw, FiInfo } from "react-icons/fi";

const menuStyle: CSSProperties = {
  position: "absolute",
  backgroundColor: "#000",
  color: "#33ff00",
  padding: "12px 18px",
  borderRadius: "6px",
  boxShadow: "0 0 12px #33ff00",
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: "14px",
  zIndex: 99999,
  userSelect: "none",
  minWidth: "180px",
};

const menuItemStyle: CSSProperties = {
  padding: "10px 14px",
  cursor: "pointer",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "background-color 0.2s ease",
};

export default function HackerContextMenu() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.pageX, y: e.pageY });
      setVisible(true);
    };

    const handleClick = () => {
      if (visible) setVisible(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [visible]);

  if (!visible) return null;

  const handleMenuClick = (action: string) => {
    setVisible(false);
    switch (action) {
      case "reload":
        window.location.reload();
        break;
      case "about":
        alert("🖥️ Hacker Terminal Web v1.0\nCreated by Toprak Paşa\nStay sneaky!");
        break;
      default:
        alert("Unknown command!");
    }
  };

  const maxWidth = 180;
  const maxHeight = 140;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let x = pos.x;
  let y = pos.y;

  if (x + maxWidth > windowWidth) x = windowWidth - maxWidth - 10;
  if (y + maxHeight > windowHeight) y = windowHeight - maxHeight - 10;

  return (
    <ul style={{ ...menuStyle, top: y + "px", left: x + "px" }}>
      <li
        style={menuItemStyle}
        onClick={() => handleMenuClick("reload")}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#33ff0044")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <FiRefreshCw /> Reload Terminal
      </li>
      <li
        style={menuItemStyle}
        onClick={() => handleMenuClick("about")}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#33ff0044")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <FiInfo /> About
      </li>
    </ul>
  );
}
