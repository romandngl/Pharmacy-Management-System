import { Link } from "react-router-dom";

const InfoNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">MyWebsite</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
          </li>
          <li>
            <Link to="/auth/signin" className="text-white hover:text-gray-300">Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default InfoNavbar;
