import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity, Alert, ImageStore, Linking} from 'react-native';
import { Container, Content, Text, Header, Body, Title,
    Right, Left, ListItem, List, Icon, Switch, Button, Separator, ActionSheet} from 'native-base';
import {
    userLogout,
    toggleAllowNotifications,
    toggleDownloadWifiOnly,
    setStorageLimit,
    toggleCommentaryOnDefault,
    profileOpenApparatusDeselect,
    getMembershipStatus,
    deleteDownloadedVideos,
    profileOpenGradesSelect,
} from "../../components/Store/actions";


export default class ProfileSettings extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            pushNotifications:(this.props.screenProps.allowNotifications)?this.props.screenProps.allowNotifications:false,
            wifi:(this.props.screenProps.downloadWifiOnly)?this.props.screenProps.downloadWifiOnly:false,
            commentaryOnDefault:(this.props.screenProps.commentaryOnDefault)?this.props.screenProps.commentaryOnDefault:false,
            membership:false,
        };
    }

    componentDidMount(){

        const {dispatch} = this.props.screenProps;
        dispatch(getMembershipStatus()).then((membership)=>{
                this.setState({membership},()=>{console.log("membership:",membership);});
        }).catch(()=>console.log);

        //const {dirs} = RNFetchBlob.fs;
        //console.log(dirs);

/*        RNFetchBlob.fs.df().then(
            (response) => {

                console.log(formatBytes(response.internal_free));
                //console.log('Free space in bytes: ' + response.internal_free);
                //console.log('Total space in bytes: ' + response.total);
            });*/

/*
        RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.CacheDir+"test.txt", RNFetchBlob.base64.encode('1234567890123'), 'base64')
            .then((result)=>{
                console.log(result,0);
            }).catch((e)=>{console.log(e)});
*/

/*        RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.CacheDir+"test.txt", 'base64')
            .then((data) => {
                console.log(RNFetchBlob.base64.decode(data));
            });*/


/*
        RNFetchBlob
            .config({
                // response data will be saved to this path if it has access right.
                path : dirs.DocumentDir + '/testfile-1.gym.mp4'
            })
            .fetch('GET', 'http://auto.video.gymnasticsmentor.com.s3.amazonaws.com/01-TRAMPOLINE/01-Grade%201/04-Hands%20and%20knees%20bouncing/HD-supported-uncommented.mp4', {
                //some headers ..
            }).progress({ count : 10, interval:1000 }, (received, total) => {
                console.log('progress', Math.ceil((received / total)*100))
            })
            .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path())
            }).catch((e)=>{console.log(e)});*/

    }

    toggleWifiOnlyDownloads = ()=>{
        const {dispatch} = this.props.screenProps;
        if(this.state.wifi){
            Alert.alert(
                'Disable Wifi Only Downloads',
                'Unselecting this may result in additional charges from your mobile service provider',
                [
                    {text: 'OK', onPress: ()=>{ }},
                ],
                { cancelable: false }
            )
        }

        this.setState({wifi:!this.state.wifi},()=>{
            dispatch(toggleDownloadWifiOnly());
        })



    };

    toggleAllowNotifications = ()=>{
        const {dispatch} = this.props.screenProps;
        this.setState({pushNotifications:!this.state.pushNotifications},()=>{
            dispatch(toggleAllowNotifications());
        });

    };


    toggleCommentaryOnDefault = ()=>{
        const {dispatch} = this.props.screenProps;
        this.setState({commentaryOnDefault:!this.state.commentaryOnDefault},()=>{
            dispatch(toggleCommentaryOnDefault());
        });

    };

    getLimitSizeText = (size)=>{

        return (size===-1)?"No Storage Limit":(size<1024)?size+"MB":parseInt(size/1024)+"GB"

    };

    onLogoutPress = ()=>{
        const {dispatch} = this.props.screenProps;
        Alert.alert(
            'Sign Out',
            'Do you want to sign out?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: ()=>{
                            dispatch(userLogout());
                    }},
            ],
            { cancelable: false }
        )
    };


    onStoragePress = ()=>{


        const storageButtons = this.state.membership.storage_size.map((size)=>(
            { text: this.getLimitSizeText(size), icon: "disc", iconColor: "#ff9933" }
        ));

        const cancelButtonIndex = storageButtons.length+1;
        const clearButtonIndex = storageButtons.length;

        ActionSheet.show(
            {
                options: [
                    ...storageButtons,
                    { text: "Clear Storage Data", icon: "trash", iconColor: "#d9534f" },
                    { text: "Cancel", icon: "close", iconColor: "#666" }
                    ],
                cancelButtonIndex,
                title: "Select Storage Limit Size"
            },
            buttonIndex => {
                if(buttonIndex === clearButtonIndex){
                    Alert.alert(
                        'Clear Storage',
                        'Do you want to delete all downloaded tutorials?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'OK',
                                onPress: () => {
                                    const {dispatch} = this.props.screenProps;
                                    dispatch(deleteDownloadedVideos("all")).then(result=>console.log(result));
                                }
                            },
                        ]
                    );
                } else if(buttonIndex!==cancelButtonIndex){
                    const {dispatch} = this.props.screenProps;
                    const limitSize = this.state.membership.storage_size[buttonIndex];
                    this.setState({limitSize},()=>{
                        dispatch(setStorageLimit(limitSize))
                    });
                }


            }
        );
    };


    onHelpPDFPress = ()=>{

        const targetUrl ="http://gymnasticsmentor.com/gymnasticsmentor_user_manua_v1.0.pdf";
        Linking.openURL(targetUrl).catch(err => console.error('An error occurred', err));

    };


    onMembershipPress = ()=>{

        Linking.openURL(this.state.membership.buy).catch(err => console.error('An error occurred', err));

    };

    render() {

        const {membership} = this.state;
        const storageUse =(this.props.screenProps.downloadedTutorialsSize)?this.props.screenProps.downloadedTutorialsSize:0;
        const limitSize = (this.props.screenProps.storageLimit)?this.props.screenProps.storageLimit:-1;
        const limitSizeText = this.getLimitSizeText(limitSize);
        const storageUseText = (limitSize===-1)?storageUse+"MB / ∞":storageUse+"MB"+" / "+limitSizeText;
        const storageUseTextColor = (limitSize!==-1&&storageUse>limitSize)?"#ed2f2f":"#ff9933";


        return (

                <Container>
                    <Header style={{ paddingTop:0}}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                                <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                            </TouchableOpacity>
                        </Left>

                        <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title>Settings</Title>
                        </Body>

                        <Right style={{ flex: 1 }}>

                        </Right>
                    </Header>


                        <Content style={{backgroundColor:"#fff"}}>
                            <List>
                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#007aff"}}>
                                            <Icon name='notifications' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <Text>Push Notifications</Text>
                                    </Body>
                                    <Right>
                                        <Switch value={this.state.pushNotifications} onValueChange={this.toggleAllowNotifications} />
                                    </Right>
                                </ListItem>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#666"}}>
                                            <Icon name='person' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate("ProfileUserDetail");
                                    }}>
                                        <Text>User Details</Text>
                                    </TouchableOpacity>

                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={() => {
                                            this.props.navigation.navigate("ProfileUserDetail");
                                        }}>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>

                                    </Right>
                                </ListItem>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#ff9933"}}>
                                            <Icon name='disc' />
                                        </Button>
                                    </Left>
                                    <Body>
                                        <TouchableOpacity onPress={this.onStoragePress}>
                                            <Text>Storage</Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={this.onStoragePress} style={{flexDirection:"row"}}>
                                            <Text style={{color:storageUseTextColor, fontSize:15}}>
                                                {storageUseText}
                                            </Text>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#ff9933"}}>
                                            <Icon name='contact' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={this.onMembershipPress}>
                                        <Text>Membership</Text>
                                    </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={this.onMembershipPress} style={{flexDirection:"row"}}>
                                            <Text style={{color:"#ff9933", fontSize:15}}>{(membership)?membership.name:""}</Text>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>

                                    </Right>
                                </ListItem>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#5c96f5"}}>
                                            <Icon name='body' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={()=> {
                                        const {dispatch} = this.props.screenProps;
                                        dispatch(profileOpenApparatusDeselect(this.props.navigation));
                                    }}>
                                    <Text>Apparatus</Text>
                                    </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <Icon name="arrow-forward" />
                                    </Right>
                                </ListItem>


                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#5c96f5"}}>
                                            <Icon name="ios-speedometer" />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={()=> {
                                        const {dispatch} = this.props.screenProps;
                                        dispatch(profileOpenGradesSelect(this.props.navigation));
                                    }}>
                                    <Text>Grades</Text>
                                    </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <Icon name="arrow-forward" />
                                    </Right>
                                </ListItem>

{/*
                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#5c96f5"}}>
                                            <Icon name='film' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <Text>Play commentary videos as default</Text>
                                    </Body>
                                    <Right>
                                        <Switch value={this.state.commentaryOnDefault} onValueChange={this.toggleCommentaryOnDefault} />
                                    </Right>
                                </ListItem>
*/}

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#5c96f5"}}>
                                            <Icon name='film' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <Text>Tutorials</Text>
                                    </Body>
                                    <Right>
                                        <Icon name="arrow-forward" />
                                    </Right>
                                </ListItem>
                                <Separator bordered>

                                </Separator>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#007aff"}}>
                                            <Icon name='wifi' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <Text>Download Wi-fi Only</Text>
                                    </Body>
                                    <Right>
                                        <Switch value={this.state.wifi} onValueChange={this.toggleWifiOnlyDownloads} />
                                    </Right>
                                </ListItem>

                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#5c96f5"}}>
                                            <Icon name='help' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={this.onHelpPDFPress} style={{flexDirection:"row"}}>
                                        <Text>View Help PDF</Text>
                                    </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={this.onHelpPDFPress} style={{flexDirection:"row"}}>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>


                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#ccc"}}>
                                            <Icon name='mail' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate("ProfileReport");
                                    }}>
                                        <Text>Report</Text>
                                    </TouchableOpacity>

                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={() => {
                                            this.props.navigation.navigate("ProfileReport");
                                        }}>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>


                                <ListItem icon>
                                    <Left>
                                        <Button disabled style={{backgroundColor:"#666"}}>
                                            <Icon name='ios-log-out' />
                                        </Button>
                                    </Left>
                                    <Body>
                                    <TouchableOpacity onPress={this.onLogoutPress}>
                                        <Text>Sign Out</Text>
                                    </TouchableOpacity>

                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={this.onLogoutPress}>
                                            <Icon name="arrow-forward" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>

                            </List>
                        </Content>

                </Container>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});