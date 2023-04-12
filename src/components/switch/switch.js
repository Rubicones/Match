import { useEffect, useState } from "react"
import './switch.css'
const Switch = (props) => {
    const [state, setState] = useState(1)

    useEffect(() => {
        props.state(state)
    }, [state])

    return (
        <section onChange={(e) => {setState(e.target.checked === true ? 2 : 1)}} className="switcherContainer">
            <span>Cast</span>
            <label className="switch">
              <input type="checkbox"/>
              <span className="slider round"></span>
            </label>
            <span>Crew</span>
        </section>
    )
}

export default Switch