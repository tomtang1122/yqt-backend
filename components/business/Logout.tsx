import { Icons } from "@components/ui/icon";
import { Button } from "@components/ui/button";
import { logoutAction } from "@lib/action";

export const Logout = () => {
  return (
    <Button variant="ghost" onClick={logoutAction}>
      <Icons.Power />
      <span>退出登录</span>
    </Button>
  );
};
