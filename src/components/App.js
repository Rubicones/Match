import './App.css';
import {Component, useEffect, useState} from 'react';
import MatchedActor from './matchedActor/matchedActor';
import Movie from './movie/movie';
import TDMBService from './services/TDMBService';
import Switch from './switch/switch';

const App = (props) => {
  const [actors, setActors] = useState([])
  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])
  const [isDiffed, setIsDiffed] = useState(false)
  const [onVPN, setOnVpn] = useState(false)
  const [switchState, setSwitchState] = useState(1)
  const tDMBService = new TDMBService()
  let blur = {"WebkitFilter": "blur(4px)"}

  useEffect(() => {
    tDMBService.createSession().then(res => console.log(res)).catch(() => {
      setOnVpn(true)
    })
  }, [])

  useEffect(() => {
    onBothFilmsSelected()
  }, [left, right])

  const onBothFilmsSelected = () => {
    const newActors = []
    if (left.length > 0 && right.length > 0) {
      left.forEach((leftElem, i) => {
        right.forEach((rightElem, j) => {
          if (rightElem.name === leftElem.name) {
            newActors.push(
              <MatchedActor 
              name={leftElem.name} 
              characterLeft={leftElem.character} 
              characterRight={rightElem.character} 
              portraitUrl={leftElem.portraitUrl}
              key={i.toString() + j.toString()}
              switchState={props.switchState}/>
            )
          }
        })
      })

      if (newActors.length > 0){
        setIsDiffed(true)
      } else {
        setIsDiffed(false)
      }
      setActors(newActors.map(item => item))
    }

  }

  const onSwitch = (state) => {
    setSwitchState(state)
    if (left.length > 0 || right.length > 0){
      console.log(1)
    }
  }

  const toSetActors = (crewListPromise, side) => {
      crewListPromise.then(res => {
        if (side == 'right'){
          setRight(res.map((actor) => {
            return {name: actor.name, character: actor.character, portraitUrl: actor.portraitUrl}
          }))
        }
  
        if (side == 'left'){
          setLeft(res.map((actor) => {
            return {name: actor.name, character: actor.character, portraitUrl: actor.portraitUrl}
          }))
        }
      })
  }

    return (
      <>
        {onVPN ? <h1 className="toVpn">Service is unavailable in your country, please try to use VPN</h1> : null}
        <div className="blur" style={onVPN ? blur : null}>
          <header>
            <h1 id='title' style={{marginBottom: 0, marginTop: 0}}>Match!</h1>
            <h5 id="subtitle" style={{color: "rgba(255, 255, 255, 0.583)", marginTop: 0}}>Find intersection of actors in your favorite films</h5>
            <Switch state={(state) => {onSwitch(state)}}/>
          </header>

          
          <div className="main">
            <div className="container-fluid">
            <div className="row">
              <div className="col-xl-4">
                <div className="movieBlock" data-side="left">
                  <Movie switchState={switchState} setActors={(crewListPromise) => toSetActors(crewListPromise, "left")}/>
                </div>
              </div>
            
            {
              isDiffed ? 
                <div className="col-xl-4">
                  <div className="actorsMatched">
                      {actors}
                  </div> 
                </div>
              :
              <div className="col-xl-4" >
                <div className="mainMessageContainer">
                  <h1 className='mainMessage'>These movies don't have intersection</h1>
                </div>
              </div>
            }
                <div className="col-xl-4">
                  <div className="movieBlock" data-side="right">
                    <Movie switchState={switchState} setActors={(crewListPromise) => toSetActors(crewListPromise, "right")}/>
                  </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      </>
    );
  
}

export default App;
