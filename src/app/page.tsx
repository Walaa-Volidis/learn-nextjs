import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const userName = user?.username;
  const welcomeMessage = userName ? `Welcome, ${userName}!` : "";

  return (
    <div>
      <h1>{welcomeMessage}</h1>
      <h1>Walaa is Cool!</h1>
    </div>
  );
}
