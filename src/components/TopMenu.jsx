import React from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import {AmplifySignOut} from "@aws-amplify/ui-react";

export class TopMenu extends React.Component {
	
	render() {
		return (
			<Menu fixed='top' stackable inverted>
			<Container>
				<Menu.Item as='a' header>
					<Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
					Crosslink Firmware Factory
				</Menu.Item>
				<Menu.Item><a href="/">Home</a></Menu.Item>
				<Dropdown item simple text='Firmware'>
					<Dropdown.Menu>
						<Dropdown.Header>Marlin</Dropdown.Header>
						<Dropdown.Item href='/Marlin'>Marlin Firmware downloads</Dropdown.Item>
						{ this.props.patronLevel >= 2 || this.props.isAdmin ? <Dropdown.Item href='/BuildDefinition'>My build definitions</Dropdown.Item> : null }
					</Dropdown.Menu>
				</Dropdown>

				{/* { this.props.isAdmin ? */}
				<Dropdown item simple text='Admin'>
					<Dropdown.Menu>
						<Dropdown.Header>Configurations</Dropdown.Header>
						<Dropdown.Item href='/FirmwareVersions'>Firmware versions</Dropdown.Item>
						<Dropdown.Item href='/MembershipExceptions'>Membership exceptions</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>{/*  : null} */}
			</Container>
			<Container>
			{ this.props.authState ? 
				<Menu.Item><AmplifySignOut /></Menu.Item>
				: null }
				</Container>
		</Menu> 
	)};
}