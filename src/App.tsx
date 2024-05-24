import './App.css';
import QRComponent from './QRComponent.tsx';

function App() {
  return (
    <div>
      <QRComponent
        type={'login'}
        sigMessage={'Welcom to DAPP'}
        did={(result) => {
          return result;
        }}
      />
    </div>
  );
}

export default App;
