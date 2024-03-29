import React from "react";
import styled from "styled-components";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NftDetails from "./pages/NftDetails";
import { Link } from "react-router-dom";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import { validateAddressAsPublicKey } from "./tools/utils";
import toast, { Toaster } from "react-hot-toast";
import { COLORS as C } from "./tools/colors";

/** ===========================================================================
 * App Component
 * ----------------------------------------------------------------------------
 * This is the main app component. It renders the header, NFT mint address
 * search input bar, and the app routes. Currently, there's only one route
 * which displays the details for a given NFT mint address.
 * ============================================================================
 */

function App() {
  const searchInput = React.useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = React.useState("");

  // Reset entered address on navigation back to base route
  React.useEffect(() => {
    const { pathname } = location;
    if (pathname.includes("/txs/")) {
      const urlAddress = pathname.replace("/txs/", "");
      if (validateAddressAsPublicKey(urlAddress)) {
        // If the address is valid select it
        setAddress(urlAddress);
      } else {
        // Otherwise redirect to / and notify the user with a toast
        toast.error("Invalid address provided in url.");
        navigate("/");
      }
    }
  }, [location, navigate]);

  // Reset entered address on navigation back to base route
  React.useEffect(() => {
    if (location.pathname === "/") {
      setAddress("");
    }
  }, [location]);

  // Handle search address on form submit (Enter key pressed)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAddressAsPublicKey(address)) {
      // Blur input on submit
      if (searchInput.current) {
        searchInput.current.blur();
      }

      navigate(`/txs/${address}`);
    } else {
      toast.error("Please check the address format.");
    }
  };

  // Clear address and re-focus search input
  const clearInput = () => {
    if (searchInput.current) {
      searchInput.current.focus();
    }
    setAddress("");
  };

  return (
    <>
      <Header>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HeaderTitle>888 - Uncovr</HeaderTitle>
        </Link>
      </Header>
      <Body>
        <Form onSubmit={handleSubmit}>
          <SearchIcon />
          <Input
            autoFocus
            type="text"
            value={address}
            ref={searchInput}
            spellCheck={false}
            placeholder="Input an NFT's mint account/address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <ClearIcon
            onClick={clearInput}
            style={{ visibility: address === "" ? "hidden" : "visible" }}
          />
        </Form>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/txs/:address" element={<NftDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Body>
      <Toaster />
    </>
  );
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const Header = styled.div`
  max-height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
`;

const HeaderTitle = styled.h1`
  color: white;
  font-size: 4em;
  font-weight: 500;
  margin-bottom: 0;
  text-decoration: none !important;

  @media (max-width: 900px) {
    font-size: 2.5em;
  }
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
  transform: translate(0, 2em);
`;

const Input = styled.input`
  width: 500px;
  height: 45px;
  border-radius: 48px;
  border: 2px solid #72e9b2;
  background-color: black;
  outline: none;
  padding-left: 42px;
  padding-right: 42px;
  

  @media (max-width: 500px) {
    width: 65vw;
    font-size: 12px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: relative;
  right: -32px;
  color: ${C.gray};
`;

const ClearIcon = styled(FaTimesCircle)`
  position: relative;
  left: -32px;
  color: ${C.gray};

  :hover {
    cursor: pointer;
    color: ${C.darkMedium};
  }
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default App;
