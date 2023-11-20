import './App.css';
import ContactList from './components/ContactList/ContactList';
import NavBar from './components/NavBar/NavBar';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

function App() {
  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ContactList />
      </Container>
    </>
  );
}

export default App;
