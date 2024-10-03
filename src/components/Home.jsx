import React from 'react'
import {NavLink} from 'react-router-dom'
import {
    Message,
  } from 'semantic-ui-react'

export class Home extends React.Component{
	render(){
		return (
			<div>
				<Message
					warning
				    icon='exclamation'
    				header='The Crosslink Firmware Factory is DEPRECATED and will SHUTDOWN on December 31, 2024, 23:59 CEST.'
    				content='Please download all your configurations and firmware builds to back up your data. We will not keep any data beyond December 31st, 2024 and there will be no way to restore it afterwards.'
  				/>
				<h3>Welcome to the Crosslink firmware factory</h3>
				<p>Here I provide downloads of pre-configured Marlin firmware for specific printers and setups as well as pre-compiled firmware binaries.</p>
				<a href="https://youtu.be/L9QcTNuHaaY" target="_blank" rel="noreferrer">Watch the introduction video here</a><br/>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/L9QcTNuHaaY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

				<h3>TERMS OF USE</h3>
				<p>This website is currently in <strong>BETA</strong> testing, so expect roughness in design, all kinds of bugs and quirks. Functionality is still limited but you see it first, which is awesome!</p>
				<p>Use the firmware with the fact in mind that I am not taking <strong>ANY</strong> responsibility for any damage possibly happening to your 3D printer or mainboard if you use firmware from this website.</p>
				<p>I am also not obliged to provide any kind of firmware or configuration at any given time if it is still missing here. The timeframe in which this project is coming to reality is still undefined so there is no guarantee or warranty to be applied to any kind of deliverables or missing features whatsoever.</p>
				<p>However, of course you can ping me directly via our <a href="https://discord.gg/ne3J4Rf" target="_blank" rel="noreferrer">discord server in the "#firmware-factory-general-discussion" channel</a>. You can also use the SUPPORT button on this page (lower right corner).</p>
				<p>Currently you will find pre-configured firmware in the "<NavLink to="/Marlin">Marlin</NavLink>" section, linked at the top of this page.</p>
				<p>THE SOFTWARE AND ALL DOWNLOADS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
				<p>BY USING THIS WEBSITE YOU AGREE TO THE TERMS ABOVE</p>
			</div>
		);
	}
}