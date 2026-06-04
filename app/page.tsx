import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";

export default async function Home() {

  const { getUser } = getKindeServerSession();
  const session = await getUser();

  return (
    <div className="p-10">
      <h1>Welcome Nethmal</h1>
      {session ? (
        <LogoutLink>
          <Button variant="outline">Logout</Button>
        </LogoutLink>
      ) : (
        <>
          <LoginLink>
            <Button variant="outline">login</Button>
          </LoginLink>
          <RegisterLink>
            <Button variant="outline">Register</Button>
          </RegisterLink>
        </>
      )}
    </div>


  );
}
