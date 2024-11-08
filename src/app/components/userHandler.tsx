import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useTasks } from "@/app/hooks/useTasks";

export default function UserHandler() {
  alert("UserHandler");
  const { user } = useUser();
  const { addUser } = useTasks(user?.id);

  useEffect(() => {
    if (user) {
      const newUser = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress,
      };
      addUser(newUser);
    }
  }, [user, addUser]);

  return null;
}
