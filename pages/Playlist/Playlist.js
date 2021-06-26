import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity,FlatList, View, Image, ImageBackground, Alert  } from 'react-native';
import { Container, Text, Header, Body, Title, Right, Left, Spinner, } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {loadPlayListTutorialData} from "../../components/Store/actions";
import playlistPlayIcon from "../../assets/playlist-play-icon.png";
import {NavigationActions} from "react-navigation";



export default class Playlist extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: true,
            userSelected: [],
            playlistData:[],
            selected: (new Map(): Map<string, boolean>),
            showBackBtn:false,
        };
    }


    componentDidMount(){

        this.loadPlaylists();

    }


    loadPlaylists = ()=>{

        const {dispatch} = this.props.screenProps;
        dispatch(loadPlayListTutorialData()).then( (playlistData)=>{
            const userPlayList = { id:"0", name: "Your Playlists", videoCount:0};
            this.setState({
                playlistData:[userPlayList,...playlistData.items],
                pagination:playlistData.pagination,
                loading:false,
            });
        });

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


    _keyExtractor = (item, index) => item.id;

    _onPressItem = async (id: string, name:string, videoCount ) => {

        const routeName = (parseInt(id)===0)?"UserPlaylists":"VideoPlayer";

        if(videoCount>0||routeName==="UserPlaylists"){
            const navigateAction = NavigationActions.navigate({
                routeName: routeName,
                params: {id,name},
            });

            this.props.navigation.dispatch(navigateAction);
        } else {
            Alert.alert(
                'Empty Playlist',
                'No video in the playlist.'
            )
        }


    };



    _renderItem = ({item, index}) => {

        return (


                <Grid>
                    <Row>
                        <Col size={6}>
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
                                            source={playlistPlayIcon}
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
                                            :
                                        null
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



                        </Col>
                    </Row>
                </Grid>


        )

    } ;



    render() {

        return (

            <Container style={styles.container}>
                <Header style={{ paddingTop:0}}>
                    <Left style={{ flex: 1 }}>
                        {
                            (this.state.showBackBtn)?
                                <TouchableOpacity onPress={() => {
                                    this.loadCategoryData();
                                }}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>
                                :
                                null
                        }

                    </Left>

                    <Body style={{ flex: 4,  justifyContent: 'center', alignItems: 'center' }}>
                    <Title>Skills</Title>
                    </Body>

                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <View style={{flex:1,}}>

                    {this.state.loading? <Spinner color="#5c96f5" /> :
                        <FlatList
                            ref="mentorPlayList"
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
        alignItems:"center"

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

