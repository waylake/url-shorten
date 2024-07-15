import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserUrls } from "../store/urlSlice";
import UrlList from "../components/UrlList";
import UrlChart from "../components/UrlChart";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { urls, loading, error } = useSelector((state: RootState) => state.url);

  useEffect(() => {
    dispatch(fetchUserUrls());
  }, [dispatch]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Dashboard
      </h1>
      {urls.length > 0 ? (
        <>
          <UrlChart urls={urls} />
          <UrlList />
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You haven't created any short URLs yet.
        </p>
      )}
    </>
  );
};

export default Dashboard;
