import { Link } from "react-router-dom";
import { isLoggedIn } from "../auth/isLoggedIn"

const Header = () => {
    const user = isLoggedIn();
    // console.log(user);
  return (
    <header>
        <h1>Easy-Ticket</h1>
        <div className="buttons">
            {user?.isAdmin && <Link to='/admin'>Admin panel</Link>}
            {user ? 
                <Link to='/logout'>Log out</Link>
                :
                <Link to='login'>Login</Link>
            }
        </div>
    </header>
  )
}

export default Header