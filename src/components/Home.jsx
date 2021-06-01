import React from 'react'
import {NavLink} from 'react-router-dom'

export class Home extends React.Component{
	render(){
		return (
			<div>
				<p>Welcome to the Crosslink firmware factory (alpha)</p>
				<p>Here we provide downloads of pre-configured Marlin firmware for specific printers and setups as well as pre-compiled firmware binaries.</p>
				<p>This website is currently in <strong>alpha</strong> testing, so please excuse roughness in design, all kinds of bugs and quirks. Functionality is still limited but you see it first, which is awesome!</p>
				<p>Use the firmware with the fact in mind that I am not taking <strong>ANY</strong> responsibility for any damage possibly happening to your 3D printer or mainboard if you use firmware from this website.</p>
				<p>I am also not obliged to provide any kind of firmware or configuration at any given time if it is still missing here. The timeframe in which this project is coming to reality is still undefined so there is no guarantee or warranty to be applied to any kind of deliverables or missing features whatsoever.</p>
				<p>However, of course you can ping me directly via our <a href="https://discord.gg/ne3J4Rf">discord server in the "#firmware-factory-alpha" channel</a></p>
				<p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page.</p>
			</div>
		);
	}
}