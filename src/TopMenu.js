import React from 'react'
import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import { SignOut } from 'aws-amplify-react';

const TopMenu = () => (
    <Menu fixed='top' inverted>
    <Container>
      <Menu.Item as='a' header>
        <Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
        Project Name
      </Menu.Item>
      <Menu.Item as='a'>Home</Menu.Item>

      <Dropdown item simple text='Dropdown'>
        <Dropdown.Menu>
          <Dropdown.Item>List Item</Dropdown.Item>
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