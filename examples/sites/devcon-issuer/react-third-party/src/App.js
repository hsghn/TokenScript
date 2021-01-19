// import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Negotiator, Authenticator } from './TokenScript';
import LogoCard from './LogoCard';
import RoomCard from './RoomCard';
import TokenCard from './TokenCard';
import Typography from '@material-ui/core/Typography';
import roomTypesData from './roomTypesDataMock.json';
import './App.css';

function App() {
  // let web3 = new Web3('HTTP://127.0.0.1:7545');
  let [tokens, setTokens] = useState([]);
  useEffect(() => { }, []);
  // Show discount is available (tickets shown on top right)
  let [discountAvailable, setDiscountAvailable] = useState(false);
  // Value of discount
  let [discountValue, setDiscountValue] = useState();
  // Validated discount, this could be sent to the backend etc
  let [validatedDiscount, setValidatedDiscount] = useState(false);
  // 1. User opens website and the negotiator is triggered
  const negotiator = new Negotiator(["discountTokens"]);
  // 2. iframe gets the tickets
  const iframe = () => {
    return {
      __html: '<iframe id="test" src="/demo.html" title="Iframe"></iframe>'
    }
  }
  // 3. listen for ticket changes and apply to view on change
  window.document.addEventListener('ticketsRecievedEvent', handleEvent, false)
  function handleEvent(e) {
    setDiscountAvailable(true);
    setTokens(e.detail)
  };
  // 4. webster selects to apply discount
  const applyDiscount = async (ticket) => {
    const response = await fetch(`./roomTypesTicketClassDataMock${ticket.ticketClass}.json`)
    const data = await response.json();
    setDiscountValue(data.discount);
    // // 5. attestation is triggered
    // const useTicketProof = await Authenticator.getAuthenticationBlob({ ticket });
    // // 6. get Challenge
    // const challenge = await Authenticator.fetchChallenge();
    // // 7. sign Challenge useTicketProof, challenge
    // const signedMsg = await Authenticator.signChallenge({ useTicketProof, challenge });
    // // 8. post signed message
    // const sentChallenge = await Authenticator.sendChallenge({ signedMsg });
    // // 9. discount can be given to the end user
    // setValidatedDiscount(sentChallenge);
  }
  return (
    <div>
      <LogoCard title={"Hotel Bogota"} />
      <div style={{ position: 'absolute', top: '0px', right: '20px' }}>
        {tokens.length > 0 &&
          <TokenCard tokensNumber={tokens.length} />
        }
      </div>
      <div className="iframeAttestation" dangerouslySetInnerHTML={iframe()} />
      <div className="roomCardsContainer">
        {roomTypesData.map((room, index) => {
          return <RoomCard key={index} room={room} applyDiscount={applyDiscount} discountAvailable={discountAvailable} discountValue={discountValue} tokens={tokens} />
        })}
      </div>
      {/* {discountAvailable && // move this to a checkout page.
        <div>
          <div className="ethScale">
            <div id="space">
              <div className="elogo">
                <div className="trif u1"></div>
                <div className="trif u2"></div>
                <div className="trif u3"></div>
                <div className="trif u4"></div>
                <div className="ct"></div>
                <div className="trif l1"></div>
                <div className="trif l4"></div>
              </div>
            </div>
          </div>
          <Typography className="applyDiscountCopyContainer" gutterBottom variant="body2" component="p">
            Devcon discount available! Enjoy the event.
          </Typography>
        </div>
      } */}
    </div>
  );
}

export default App;
