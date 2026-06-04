import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-10">
      <h1>Wellcome Nethmal</h1>
      <LoginLink>
         <Button variant="outline">Sign in</Button>
      </LoginLink>
      <RegisterLink>
         <Button variant="outline">Sign up</Button>
      </RegisterLink>
    </div>

  );
}
