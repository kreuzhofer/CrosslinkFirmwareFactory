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

      <Dropdown item simple text='Admin'>
        <Dropdown.Menu>
          <Dropdown.Item href='/BuildDefinition'>Build Definitions</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>List Item</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Header Item</Dropdown.Header>
          <Dropdown.Item>
            <i className='dropdown icon' />
            <span className='text'>Submenu</span>
            <Dropdown.Menu>
              <Dropdown.Item>List Item</Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item>List Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
    <Container>
      <Menu.Item as="a"><SignOut/></Menu.Item>
    </Container>
  </Menu> 
)

export default TopMenu