import React from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import { SignOut } from 'aws-amplify-react';
import {NavLink} from 'react-router-dom'

const TopMenu = () => (
    <Menu fixed='top' inverted>
    <Container>
      <Menu.Item as='a' header>
        <Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
        Crosslink Firmware Factory
      </Menu.Item>
      <Menu.Item><NavLink to={`/`}>Home</NavLink></Menu.Item>
      <Menu.Item><NavLink to={`/Marlin`}>Marlin</NavLink></Menu.Item>

      <Dropdown item simple text='Admin'>
        <Dropdown.Menu>
          <Dropdown.Header>Configurations</Dropdown.Header>
          <Dropdown.Item href='/BuildDefinition'>Build Definitions</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
    <Container>
      <Menu.Item as="a"><SignOut/></Menu.Item>
    </Container>
  </Menu> 
)

export default TopMenu