import React, { useEffect, useState } from "react";
import { Router } from "./components/Router";
import { setAccessToken } from "./AccessToken";

interface Props {}

const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/refresh-token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      console.log("data:", accessToken);
      console.log("Refreshed access token:", accessToken);
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Router refresh={refresh} setRefresh={setRefresh} />;
};

export default App;
