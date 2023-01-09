import {
  Container,
  Dropdown,
  Image,
  Menu,
  Grid
} from 'semantic-ui-react'
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Outlet, useNavigate } from 'react-router-dom';

const TopMenu = (props) => {

	const { route, signOut, user } = useAuthenticator((context) => [
		context.route,
		context.signOut,
		context.user
	  ]);
	const navigate = useNavigate();
	if(user)
	{
		console.log(user);
	}

	function LogOut() {
		signOut();
		navigate('/login');
		}

	return (
		<>
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
					{ props.patronLevel >= 1 || props.isAdmin ? <Dropdown.Item href='/BuildDefinition'>My build definitions</Dropdown.Item> : null }
				</Dropdown.Menu>
			</Dropdown>
			<Menu.Item>
				<a href='https://discord.com/channels/554332400998547486/738041652282916895' target='_blank' rel="noreferrer">Help</a>
				</Menu.Item>
			<Dropdown item simple text='About'>
				<Dropdown.Menu>
					<Dropdown.Item href='https://crosslink.io/impressum-anbieterkennzeichnung/'>Imprint / Impressum</Dropdown.Item>
					<Dropdown.Item href='https://crosslink.io/datenschutzerklaerung/'>Privacy / Datenschutzerklärung</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

			{ props.isAdmin ? 
			<Dropdown item simple text='Admin'>
				<Dropdown.Menu>
					<Dropdown.Header>Configurations</Dropdown.Header>
					<Dropdown.Item href='/FirmwareVersions'>Firmware versions</Dropdown.Item>
					<Dropdown.Item href='/MembershipExceptions'>Membership exceptions</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown> : null}

			<Dropdown item simple icon="user">
				<Dropdown.Menu>
				{ user ? 
				<>
				<Dropdown.Header>Welcome, {user.attributes.email}</Dropdown.Header>
				<Dropdown.Item href='/Profile'>Edit Profile</Dropdown.Item>
				<Dropdown.Item onClick={() => LogOut()}>Sign Out</Dropdown.Item>
				</>
				:
				<>
				<Dropdown.Item onClick={()=>navigate('/login')}>Login</Dropdown.Item>
				</>
				}
				</Dropdown.Menu>
			</Dropdown>
		</Container>
	</Menu>

	<Grid padded>
        <Grid.Row>
          <Grid.Column>
            {/* This is a spacer */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
			  <Outlet/>
          </Grid.Column>
         </Grid.Row>
    </Grid>
	</>
	)};

export default TopMenu;