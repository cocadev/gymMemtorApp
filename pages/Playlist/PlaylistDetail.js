import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity,FlatList, View, Image,ImageStore, ActivityIndicator } from 'react-native';
import {
    Container,
    Text,
    Header,
    Body,
    Title,
    Right,
    Left,
    Spinner,
    Icon,
    Switch,
    Button,
    Item,
    Input,
    ActionSheet,
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {
    duplicatePlayList, updatePlayList, createPlayList,
    loadPlayListData, addToPlayListSelect, toggleSelectMode
} from "../../components/Store/actions";
import ImagePicker from 'react-native-image-crop-picker';
import logoPlaceholder from "../../assets/logo-large.png";
import {NavigationActions} from "react-navigation";



export default class PlaylistDetail extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: true,
            userSelected: [],
            playlistData:{
                tutorials:{
                    items:[]
                }
            },
            deleting:false,
            selected: (new Map(): Map<string, boolean>),
            showBackBtn:true,
            playlistTitle:"",
            auto_download:false,
        };
    }


    async componentDidMount(){

        const {params} = this.props.navigation.state;
        const {id} = this.props.navigation.state.params;
        const {dispatch} = this.props.screenProps;

        switch (params.type){

            case "create":
                await dispatch(createPlayList(this.state.playlistTitle)).then(
                    async (playlistData)=>{
                        this.setState({
                            playlistData,
                            auto_download:!!playlistData.auto_download,
                            playlistImage:(playlistData.playlistImage)?playlistData.playlistImage:false,
                            loading:false,
                        });
                    }
                );
                this.setState({loading:false});
                break;
            case "edit":
                await dispatch(loadPlayListData(id,"","caller7")).then(
                    async (playlistData)=>{
                        this.setState({
                            playlistData,
                            auto_download:!!parseInt(playlistData.auto_download),
                            playlistImage:(playlistData.playlistImage)?playlistData.playlistImage:false,
                            loading:false,
                        });
                    }
                );
                break;
            case "duplicate":
                await dispatch(duplicatePlayList(id)).then(
                    async (playlistData)=>{
                        this.setState({
                            playlistData,
                            auto_download:!!playlistData.auto_download,
                            playlistImage:(playlistData.playlistImage)?playlistData.playlistImage:false,
                            loading:false,
                        });
                    }
                );

                break;

        }



    }

    componentWillReceiveProps(nextProps){

        let isPlayListsUpdated = false;
        if (nextProps.screenProps.state) {
            if (nextProps.screenProps.state.isPlaylistUpdated) {
                isPlayListsUpdated = true;
            }
        }

        if(isPlayListsUpdated){
            const {dispatch} = nextProps.screenProps;
            const {id} = nextProps.navigation.state.params;
            dispatch(loadPlayListData(id,"","caller8")).then(
                async (playlistData)=>{
                    if(!playlistData.error){
                        this.setState({
                            playlistData,
                            auto_download:!!playlistData.auto_download,
                            playlistImage:(playlistData.playlistImage)?playlistData.playlistImage:false,
                            loading:false,
                        });
                    }

                }
            );
        }

    }


    updatePlaylist = ()=>{

        const {dispatch} = this.props.screenProps;
        dispatch(updatePlayList(this.state.playlistData)).catch((e)=>{console.log(e);});

    };

    selectPlaylistImage = ()=>{


        const BUTTONS = [
            { text: "CAMERA", icon: "camera", iconColor: "#5c96f5" },
            { text: "GALLERY", icon: "albums", iconColor: "#5c96f5" },
            { text: "Cancel", icon: "close", iconColor: "#666" }
        ];

        const CANCEL_INDEX = 2;

        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: "Select Playlist Image"
            },
            buttonIndex => {

                switch(parseInt(buttonIndex)){
                    case 0:
                        ImagePicker.openCamera({
                            width: 600,
                            height: 600,
                            cropping: true
                        }).then(image => {
                            ImageStore.getBase64ForTag(image.path, (base64Data) => {
                                this.setState({
                                    playlistData:{
                                        ...this.state.playlistData,
                                        image:base64Data,
                                    }
                                },()=>{
                                    this.updatePlaylist();
                                });
                            }, (reason) => console.error(reason));

                        }).catch(
                            error=>{
                                //User cancelled selection.
                                console.log(error);
                            });
                        break;
                    case 1:
                        ImagePicker.openPicker({
                            width: 600,
                            height: 600,
                            cropping: true
                        }).then(image => {
                            ImageStore.getBase64ForTag(image.path, (base64Data) => {
                                this.setState({
                                    playlistData:{
                                        ...this.state.playlistData,
                                        image:base64Data,
                                    }
                                },()=>{
                                    this.updatePlaylist();
                                });
                            }, (reason) => console.error(reason));

                        }).catch(
                            error=>{
                                //User cancelled selection.
                                console.log(error);
                            });
                        break;
                    default:
                        break;

                }



            }
        );



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


    _keyExtractor = (item, index) => item.tutorial_id;

    _onPressItem = (id: string ) => {

        let deleting=false;
        const updatedItems = this.state.playlistData.tutorials.items.filter((item)=>{
            if(item.tutorial_id === id){deleting=id}
            return item.tutorial_id !== id
         });

        const updatedData = {
            ...this.state.playlistData,
            tutorials:{
                ...this.state.playlistData.tutorials,
                items:updatedItems,
            },
        };

        const {dispatch} = this.props.screenProps;
        dispatch(updatePlayList(updatedData));

         this.setState({
             deleting,
         });

    };

    _renderItem = ({item, index}) => {

        return (



                <Grid>

                    <Row style={{height:48, alignItems:"center"}}>
                        <Col size={1} style={{alignItems:"center"}}>

                            <Text style={{color:"#5c96f5"}}>
                                {index+1}
                            </Text>

                        </Col>
                        <Col size={6}>
                            <Text style={{}}>
                                {(item.name)?item.name:"Untitled"}
                            </Text>


                        </Col>
                        <Col size={1} style={{alignItems:"flex-end", paddingRight:10}}>
                            <TouchableOpacity activeOpacity={0.7} onPress={()=>this._onPressItem(item.tutorial_id)}>
                                {
                                    (this.state.deleting===item.tutorial_id)?
                                        <ActivityIndicator  size="small" color="#5c96f5" />
                                        :
                                        <Icon name='ios-remove-circle-outline' style={{color:"#d9534f",}} />
                                }

                            </TouchableOpacity>

                        </Col>
                    </Row>
                </Grid>


        )

    } ;



    render() {

        const playListTitle = this.props.navigation.state.params.name;
        const {params} = this.props.navigation.state;

        return (

            <Container style={styles.container}>
                <Header>
                    <Left style={{flex:1}} >
                        {
                            (this.state.showBackBtn)?
                                <TouchableOpacity
                                    onPress={() => {
                                    this.props.navigation.goBack();
                                }}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>
                                :
                                null
                        }

                    </Left>

                    <Body style={{ flex:4, justifyContent: 'center', alignItems:"center"}}>
                    <Title >{playListTitle}</Title>
                    </Body>
                    <Right style={{ flex:1}} />


                </Header>
                <View style={{flex:1}}>

                    {this.state.loading? <Spinner color="#5c96f5" /> :

                        <View style={{flex:1, marginTop:20 }}>
                            <Grid>
                                <Row style={{ height:120}}>
                                    <Col style={{
                                        width:140,
                                        alignItems:'center',
                                        justifyContent:'center',
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                width:120,
                                                height:120,

                                            }}
                                            activeOpacity={0.7}
                                            onPress={()=>{
                                                this.selectPlaylistImage();
                                            }}>


                                                <Image
                                                    style={{
                                                        width:"100%",
                                                        height:"100%",
                                                        borderColor:"#5c96f5",
                                                        borderWidth:2,
                                                    }}
                                                    source={(this.state.playlistData.image)?{uri:"data:;base64,"+this.state.playlistData.image}:logoPlaceholder}
                                                    resizeMode="contain"
                                                />

                                            <Icon
                                                name="camera"
                                                style={{
                                                    position:"absolute",
                                                    bottom:6,
                                                    right:6,
                                                    fontSize:18,
                                                    color:"#5c96f5",
                                                }}/>

                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{paddingTop:10}}>
                                        <Row style={{ }}>
                                            <Col style={{}}>
                                                <Text style={{
                                                    fontSize:12,
                                                    color:"#444"
                                                }} >TITLE</Text>

                                                <Item style={{
                                                    borderWidth:0,

                                                }}>
                                                    <Icon active name='create' />
                                                    <Input
                                                        placeholder="Untitled Playlist"
                                                        name="title"
                                                        style={{
                                                            fontFamily:"Montserrat-Regular",
                                                            fontSize:18,
                                                        }}
                                                        value={(this.state.playlistData.name)?this.state.playlistData.name:""}
                                                        onChangeText={(text) => this.setState({
                                                            playlistData:{
                                                                ...this.state.playlistData,
                                                                name:text,
                                                            }
                                                        })}
                                                        onEndEditing={()=>{
                                                            this.updatePlaylist();
                                                        }}
                                                    />
                                                </Item>

                                            </Col>
                                        </Row>
                                        <Row style={{ height:30, justifyContent:"flex-end", alignItems:"center", paddingRight:10}}>
                                            <Text style={{
                                                fontFamily:"Montserrat-Regular",
                                                fontSize:14,
                                            }} >Auto Download</Text>
                                            <Switch value={this.state.auto_download} onValueChange={()=>{
                                                this.setState((state)=>({
                                                    auto_download:!state.auto_download,
                                                    playlistData:{
                                                        ...state.playlistData,
                                                        auto_download:(!state.auto_download)?1:0,
                                                    },

                                                }),()=>{
                                                    this.updatePlaylist();
                                                })
                                            }} />
                                        </Row>

                                    </Col>
                                </Row>
                                <Row style={{ height:56, justifyContent:"flex-end", alignItems:"flex-end",  paddingRight:10,  paddingTop:10 }}>

                                    <Button
                                        style={{
                                            width:156,
                                            height:36,
                                            paddingTop:4,
                                            borderRadius:10,
                                            backgroundColor:"#fff",
                                            justifyContent:"center",
                                            alignItems:"center",
                                            borderColor:"#5c96f5",
                                            borderWidth:2,
                                            elevation:0
                                        }}
                                        iconLeft
                                        rounded
                                        onPress={()=>{
                                            const {dispatch} = this.props.screenProps;

                                            dispatch(addToPlayListSelect(this.state.playlistData.playlist_id)).then(async ()=>{
                                                const navigateAction = NavigationActions.navigate({
                                                    routeName: "Videos",
                                                    params: {addToPlayListId:this.state.playlistData.playlist_id},
                                                    action: NavigationActions.navigate({ routeName: 'ApparatusSelect' }),
                                                });

                                                await this.props.navigation.dispatch(navigateAction);
                                            }).then(()=>{
                                                dispatch(toggleSelectMode());
                                            });
                                        }}>
                                        <Icon name="ios-add-circle-outline" style={{color:"#5c96f5", paddingTop:0, marginTop:0}}/>
                                        <Text style={{fontFamily:"Montserrat-SemiBold", textAlign:"center", color:"#5c96f5", fontSize:13 }}>Add Videos</Text>
                                    </Button>

                                </Row>

                                <Row>
                                    <FlatList
                                        ref="playListDetail"
                                        data={(this.state.playlistData.tutorials)?(this.state.playlistData.tutorials.items):[]}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem}
                                        ItemSeparatorComponent={this._renderSeparator}

                                    />
                                </Row>

                            </Grid>





                        </View>
                    }

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
        flex:1,
        padding:10,

    },
    listItemIcon:{
        flex:1,
        width:"100%",
        height:"100%",

    },
    listItemColTitle: {
        paddingLeft:15,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:"center",

    },
    listItemText:{
        fontSize:12,
        fontFamily:"Montserrat-Regular",
    },
    listItemSubText:{
        fontSize:12,
        textAlign:"left",
        fontFamily:"Montserrat-SemiBold",
        color:"#999"
    },


});

