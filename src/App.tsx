import './App.css';
import LoginQRComponent from './LoginQRComponent.tsx';

function App() {
  return (
    <div>
      <LoginQRComponent
        sigMessage={'Welcom to DAPP'}
        did={(result) => {
          return result;
        }}
      />
    </div>
  );
}

export default App;
