import './App.css';
import Cursor from './helper/Cursor';

export default function App({ children }) {
  return (
    <div>
      <Cursor />
      {children}
    </div>
  );
}
