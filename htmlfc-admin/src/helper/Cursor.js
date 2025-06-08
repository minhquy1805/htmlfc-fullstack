// Cursor.js
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Cursor.css";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{ x: position.x - 10, y: position.y - 10 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  );
}
