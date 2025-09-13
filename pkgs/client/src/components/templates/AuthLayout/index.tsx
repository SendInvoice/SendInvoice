import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useUser } from "../../../hooks/user";

export default function AuthLayout() {
  const navigate = useNavigate();
  const user = useUser();

  useLayoutEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div>
      <Outlet />
    </div>
  );
}
