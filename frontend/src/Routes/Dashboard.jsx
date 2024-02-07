import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balence";
import { Users } from "../components/users";

export function Dashboard(){
  return <>
  <div className="mt-10 ml-10 mr-80">
    <Appbar />
    <div className="ml-10 mt-10 mr-20">
      <Balance value={"10,000"}/>
      <Users />
    </div>
  </div>
  </>
}