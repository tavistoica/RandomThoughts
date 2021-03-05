import React, { useEffect, useState } from "react";
import { AddThought } from "../components/add-thought/AddThought";
import { ThoughtList } from "../components/thought-list/ThoughtList";
import { getAccessToken } from "../AccessToken";

export const MainPage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    console.log(loading);
  }, [loading]);

  return (
    <>
      {getAccessToken() && <AddThought setLoading={setLoading} />}
      <ThoughtList reload={loading} />
    </>
  );
};
