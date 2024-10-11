import { getCurrentSession } from "@/lib/auth";
import Login from "./Login";

export default async function LoginPage() {
  const session = await getCurrentSession();

  return (
    <div className="mt-5 ml-5">
      <div>
        <Login />
      </div>
      {session.user && <div className="mt-5">Hello, {session.user.name}!</div>}
    </div>
  );
}
