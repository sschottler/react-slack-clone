import React, { Component } from 'react'
import {
  Grid,
  Header,
  Icon,
  Image,
  Dropdown,
  Modal,
  Input,
  Button
} from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
import firebase from '../../firebase'

export class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: ''
  }

  openModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ]

  handleChange = event => {
    const file = event.target.files[0]
    const reader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result })
      })
    }
  }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out'))
  }

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob)
        this.setState({ croppedImage: imageUrl, blob })
      })
    }
  }

  render() {
    const { user, modal, previewImage, croppedImage } = this.state
    const { primaryColor } = this.props

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header style={{ padding: '0.25rem' }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>

        <Modal open={modal} onClose={this.closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              onChange={this.handleChange}
              type="file"
              label="New Avatar"
              name="previewImage"
            />

            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={node => (this.avatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color="green">
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" onClick={this.handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid>
    )
  }
}

export default UserPanel
