import React, { Component } from 'react';
import { Text, Footer, FooterTab, Button, Icon} from 'native-base';


export default class FooterMain extends Component<{}> {

    render() {

        return (

            <Footer>
                <FooterTab>
                    <Button vertical>
                        <Icon name="apps" />
                        <Text>Home</Text>
                    </Button>
                    <Button vertical>
                        <Icon name="camera" />
                        <Text>Videos</Text>
                    </Button>
                    <Button vertical active>
                        <Icon active name="navigate" />
                        <Text>Playlist</Text>
                    </Button>
                    <Button vertical>
                        <Icon name="person" />
                        <Text>Profile</Text>
                    </Button>
                </FooterTab>
            </Footer>

        );
    }
}




