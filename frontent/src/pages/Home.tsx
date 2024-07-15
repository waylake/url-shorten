import React from "react";
import UrlForm from "../components/UrlForm";

const Home: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
        Shorten Your URLs
      </h1>
      <UrlForm />
    </div>
  );
};

export default Home;
