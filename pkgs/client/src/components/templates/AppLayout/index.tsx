import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "../../molecules/Navbar";
import { useUser } from "../../../hooks/user";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useUser();

  useLayoutEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user]);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content-area">
        {user ? <Outlet /> : <p>Loading...</p>}
      </div>
    </div>
  );
}
