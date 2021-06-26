import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity,FlatList, View, Image, ImageBackground, Alert  } from 'react-native';
import {Container, Text, Header, Body, Title, Right, Left, Spinner, Icon, Button, ActionSheet} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {deletePlayList, loadPlayListData} from "../../components/Store/actions";
import playlistCreateIcon from "../../assets/playlist-create-icon.png";
import {NavigationActions} from "react-navigation";



export default class UserPlaylist extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: true,
            userSelected: [],
            playlistData:[],
            selected: (new Map(): Map<string, boolean>),
            showBackBtn:true,
        };
    }

    async componentDidMount(){

        await this.loadPlayListData(false,"","caller4").catch((error)=>console.log(error));

    }

    componentWillReceiveProps(nextProps){

        let isPlayListsUpdated = false;
        if (nextProps.screenProps.state) {
            if (nextProps.screenProps.state.isPlaylistUpdated) {
                isPlayListsUpdated = true;
            }
        }

        //nextProps.screenProps.changedState === "PlayLists" || isPlayListsUpdated
        if(isPlayListsUpdated){
            //console.log( "userPlaylistReceiveProps:",nextProps.screenProps);
            this.loadPlayListData().catch((error)=>console.log(error));
        }

    }

    loadPlayListData = async()=>{

        const {dispatch} = this.props.screenProps;
        await dispatch(loadPlayListData(false,"","caller6")).then(
            async (playlistData)=>{
                if(playlistData.items){
                    const createPlaylist = { id:"0", name: "Create Playlist"};
                    this.setState({
                        playlistData:[createPlaylist,...playlistData.items],
                        pagination:playlistData.pagination,
                        loading:false,
                    });
                }

            }
        );

    };


    deleteFromList = async(id)=>{

        const {dispatch} = this.props.screenProps;
        const updatedPlaylist = this.state.playlistData.filter((item)=>(id!==item.id));
        this.setState({
            playlistData:updatedPlaylist,
        });
        dispatch(deletePlayList(id));

    };


    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#ddd",
                }}
            />
        );
    };


    _keyExtractor = (item, index) => item.id+index.toString();

    _onPressItem = (id: string, name:string, videoCount ) => {

        const type = (parseInt(id)===0)?"create":"";

        if(videoCount>0||type==="create"){

            const routeName = (parseInt(id)===0)?"PlaylistDetail":"VideoPlayer";
            const navigateAction = NavigationActions.navigate({
                routeName: routeName,
                params: {id,name,type},
            });
            this.props.navigation.dispatch(navigateAction);
        } else {
            Alert.alert(
                'Empty Playlist',
                'No video in the playlist.'
            )
        }

    };

    _onPressItemMore = (id: string, name:string, videoCount ) => {


        const BUTTONS = [
            { text: "Edit", icon: "create", iconColor: "#5c96f5" },
            { text: "Duplicate", icon: "add", iconColor: "#5c96f5" },
            { text: "Download", icon: "download", iconColor: "#5c96f5" },
            { text: "Delete", icon: "trash", iconColor: "#d9534f" },
            { text: "Cancel", icon: "close", iconColor: "#666" }
        ];

        const DESTRUCTIVE_INDEX = 3;
        const CANCEL_INDEX = 4;

        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: name
            },
            buttonIndex => {

                const routeName = "PlaylistDetail";
                let navigateAction;

                switch(parseInt(buttonIndex)){
                    case 0:

                        navigateAction = NavigationActions.navigate({
                            routeName: routeName,
                            params: {id,name:"Edit Playlist",type:"edit"},
                        });
                        this.props.navigation.dispatch(navigateAction);

                        break;
                    case 1:

                        navigateAction = NavigationActions.navigate({
                            routeName: routeName,
                            params: {id,name:"Create Playlist",type:"duplicate"},
                        });
                        this.props.navigation.dispatch(navigateAction);
                        break;
                    case 2:
                        if( videoCount>0){
                            Alert.alert(
                                'Download',
                                'Do you want to download all videos for selected playlist?\n(If you select yes, download process will begin in the background.)',
                                [
                                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                                    {
                                        text: 'YES', onPress: () => {

                                        }
                                    },
                                ],
                                { cancelable: false }
                            );
                        } else {
                            Alert.alert(
                                'Download',
                                'No video in the selected playlist.',
                                [
                                    {text: 'OK'},
                                ],
                                { cancelable: false }
                            );
                        }

                        break;
                    case 3:
                        Alert.alert(
                            'Delete Playlist',
                            'Do you want to delete '+name+' ?',
                            [
                                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                                {
                                    text: 'OK', onPress: () => {
                                        this.deleteFromList(id).catch((error)=>console.log(error));
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                        break;
                    default:
                        break;

                }



            }
        )


    };

    _renderItem = ({item, index}) => {

        return (

                <Grid>
                    <Row>
                        <Col size={6} >
                            <TouchableOpacity style={styles.listItemColImage} activeOpacity={0.7} onPress={()=>this._onPressItem(item.id,item.name,item.videoCount)}>
                            <ImageBackground
                                source={require("../../assets/playlist-bg.png")}
                                style={{
                                    flex: 1,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width:"100%",
                                    height:"100%",
                                    paddingTop:2,
                                    paddingLeft:1,
                                }}
                                imageStyle={{resizeMode: 'contain'}}
                            >
                                {
                                    (index===0)?
                                        <Image
                                            style={{
                                                flex: 1,
                                                width:"85%",
                                                height:"85%",
                                            }}
                                            source={playlistCreateIcon}
                                            resizeMode="contain"
                                        />
                                        :
                                        (item.image)?
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    width:"87%",
                                                    height:"87%",
                                                    marginRight:2,
                                                    marginTop:2
                                                }}
                                                source={{uri:"data:;base64,"+item.image}}
                                                resizeMode="contain"
                                            />
                                            :null
                                }

                            </ImageBackground>

                            </TouchableOpacity>

                        </Col>
                        <Col size={14} style={styles.listItemColTitle}>
                            <TouchableOpacity activeOpacity={0.7} onPress={()=>this._onPressItem(item.id,item.name,item.videoCount)}>
                            <Text style={styles.listItemText}>
                                {item.name}
                            </Text>
                            {
                                (index===0)?
                                    null
                                    :
                                    <Text style={styles.listItemSubText}>
                                        {item.videoCount+" Videos"}
                                    </Text>
                            }
                            </TouchableOpacity>
                        </Col>
                        <Col size={2} style={styles.listItemColMore}>
                            {
                                (index === 0) ?
                                    null
                                    :
                                    <TouchableOpacity style={{
                                        width:"100%",
                                        height:"100%",
                                        alignItems:"center",
                                        justifyContent:"center",
                                    }} onPress={()=>this._onPressItemMore(item.id,item.name, item.videoCount)}>
                                        <Icon name="more" style={{color:"#5c96f5"}}/>
                                    </TouchableOpacity>
                            }


                        </Col>
                    </Row>
                </Grid>


        )

    } ;



    render() {

        return (

            <Container style={styles.container}>
                <Header>
                    <Left style={{ flex: 1 }}>
                        {
                            (this.state.showBackBtn)?
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.goBack();
                                }}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>
                                :
                                null
                        }

                    </Left>

                    <Body style={{ flex: 4,  justifyContent: 'center', alignItems: 'center' }}>
                    <Title>Your Playlists</Title>
                    </Body>

                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <View style={{flex:1,}}>

                    {this.state.loading? <Spinner color="#5c96f5" /> :
                        <FlatList
                            ref="userPlayList"
                            data={this.state.playlistData}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            ItemSeparatorComponent={this._renderSeparator}
                        />}

                </View>
            </Container>



        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    listItemColImage: {
        height:100,
        alignItems:"center",
        justifyContent:"center",
        padding:5,

    },

    listItemIcon:{
        flex:1,
        width:"100%",
        height:"100%",

    },
    listItemColTitle: {
        paddingLeft:0,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:"center",

    },
    listItemColMore: {
        paddingLeft:0,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:"center",
        alignItems:"center",


    },
    listItemText:{
        fontSize:16,
        fontFamily:"Montserrat-Regular",
    },
    listItemSubText:{
        fontSize:12,
        textAlign:"left",
        fontFamily:"Montserrat-SemiBold",
        color:"#999"
    },


});

