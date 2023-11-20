import { Container, Menu } from "semantic-ui-react";
import "./NavBar.css";

function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item style={{ color: "white", fontSize: "32px", fontWeight: "bold", width: "100%", border: "none" }}>
                    Contacts
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default NavBar;