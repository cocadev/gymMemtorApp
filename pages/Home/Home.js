import React, { Component } from 'react';
import {
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator,
    Image,
    View,
    StatusBar
} from 'react-native';
import { Container, Content, Text, Header, Icon, Body, Title, Right, Left, List, ListItem, Thumbnail} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import SearchView from "../../components/SearchBox/SearchView";
import {setSearchView, showFooter, loadNotifications,} from "../../components/Store/actions";
import {NavigationActions, StackActions} from "react-navigation";
import {getInitialScreen} from "../../components/Store/effects";
//import ModalFullScreen, { modalTypes } from "../../components/ModalFullScreen/ModalFullScreen";

const homeThumbnails = {
    promo:require('../../assets/home-icons/home-icon-1.png'),
    user:require('../../assets/home-icons/home-icon-2.png'),
    system:require('../../assets/home-icons/home-icon-3.png'),
    app:require('../../assets/home-icons/home-icon-4.png'),
};


export default class Home extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            showSearchView:false,
            notificationData:[],
            //modalVisible:false,
            //modalContent:modalTypes.generalWarning,
            modalData:false,
            videos: [],
        };

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );

    }

    async componentDidMount(){

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

        const initialScreen = await getInitialScreen(this.props.screenProps);

        if(initialScreen!=="Home"){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: initialScreen}),
                ]
            });

            const navigateAction = NavigationActions.navigate({
                routeName:initialScreen,
            });

            this.props.navigation.dispatch(navigateAction);
            this.props.navigation.dispatch(resetAction);
            this.setState({isLoading:false});
        } else {
            this.setState({isLoading:false});
        }

/*        setTimeout(()=>{
            this.setState({modalVisible:false},()=>{

            });
        },7000);*/




        //this.getNotifications();

    }

    componentWillReceiveProps(nextProps){

        if(nextProps.screenProps.Notifications.length>0){
            const filteredData = this.state.notificationData.filter((notification)=>{
                let hasItem = false;
                nextProps.screenProps.Notifications.forEach((item)=>{
                    if (notification.id===item.id){hasItem=true}
                });
                return !hasItem;
            });

            const updatedData = [...nextProps.screenProps.Notifications,...filteredData].map((notification)=>({
                ...notification,
                type:(notification.type)?notification.type:"app",
                subText: "See More",
                thumbnail:homeThumbnails[(notification.type)?notification.type:"app"],
            }));

            this.setState({notificationData:updatedData});
        }


    }

    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    backHandler = ()=> {

        if(this.props.screenProps.searchView.home){
            this.props.screenProps.dispatch(setSearchView("home",false)).then(()=>{
                this.props.screenProps.dispatch(showFooter());
            });
        }

        return true;

    };

    getNotifications = ()=>{

        const {dispatch} = this.props.screenProps;
        dispatch(loadNotifications()).then((result)=>{

            if(Array.isArray(result)){
                const notificationData = result.map((notification)=>({
                    ...notification,
                    id:notification.notification_id,
                    subText: "See More",
                    thumbnail:homeThumbnails[notification.type],
                }));

                this.setState({
                    isLoading: false,
                    notificationData,
                },()=>{
                    //console.log(this.state);
                });
            }

        }).catch((e)=>{console.log(e)});

    };

    showModal = ()=>{

        this.setState({
            modalVisible:true
        });

    };

    dismissModal = ()=>{

        this.setState({
            modalVisible:false
        });

    };

    nextModalAction = async (modal)=>{

        switch(modal.currentModal){

            case modalTypes.apparatusTutorial:

                break;

            default:
                break;


        }


        this.dismissModal();


    };


    _onRefresh = ()=> {
        this.setState({refreshing: true},()=>{
           this.setState({refreshing: false});

        });

    };


    renderVideo({ item }) {
        const video = item;

        return (
            <TouchableOpacity
                key={video.title}
                onPress={() => this.cast(video)}
                style={{ flexDirection: 'row', padding: 10 }}
            >
                <Image
                    source={{ uri: video.imageUrl }}
                    style={{ width: 160, height: 90 }}
                />
                <View style={{ flex: 1, marginLeft: 10, alignSelf: 'center' }}>
                    <Text style={{}}>{video.title}</Text>
                    <Text style={{ color: 'gray' }}>{video.studio}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    render() {

        const {notificationData} = this.state;

        return (

            (this.state.isLoading)?
                <Container style={{backgroundColor:"#fff",justifyContent:"center"}}>
                    <ActivityIndicator size="large" color="#5c96f5" />
                </Container>
                :
                <Container style={styles.homeContainer}>

                    <Header style={{
                        paddingTop:0,
                    }}>
                        <Left style={{ flex: 1 }}>
                        </Left>

                        <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title>Notifications</Title>
                        </Body>

                        <Right style={{ flex: 1 }}>
                            <TouchableOpacity style={{width:32, }} onPress={()=>{
                                this.setState((state)=>({showSearchView:!state.showSearchView}),()=>{
                                    if(!this.state.showSearchView){
                                        this.props.screenProps.dispatch(showFooter());
                                    }
                                });
                            }}>
                                <Icon name="search" style={{color:"#fff", alignSelf:"flex-end"}}/>
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    {
                        (this.state.showSearchView)&&
                        <SearchView
                            style={{top:0, position:"absolute"}}
                            dispatch={this.props.screenProps.dispatch}
                            screen="home"
                            showSearchOverlay={this.props.screenProps.searchView.home}
                            navigation={this.props.navigation}
                            autoFocus={true}
                        />
                    }

{/*
                    <ModalFullScreen
                        modalVisible={this.state.modalVisible}
                        dismissModal={this.dismissModal}
                        nextAction={this.nextModalAction}
                        transparent={false}
                        modalContent={this.state.modalContent}
                        modalData={this.state.modalData}
                    />
*/}


                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>

                        <List>

                            {
                                notificationData.map((homeItem,idx)=>{
                                    return <ListItem style={styles.listItem} key={idx+"-homeItem-"+homeItem.id}>
                                        <Grid>
                                            <Row>
                                                <Col size={30}>
                                                    <Thumbnail style={styles.listItemThumbnail} square source={homeItem.thumbnail} />
                                                </Col>
                                                <Col size={68}>
                                                    <Row>
                                                        <Text style={styles.listItemText}>{homeItem.message}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text style={styles.listItemSubText}>{homeItem.subText}</Text>
                                                    </Row>
                                                </Col>
                                                <Col size={2}>
                                                    <Row size={2}/>
                                                    <Row size={1}>
                                                        {/*<Icon name="more" style={{color:"#666"}} />*/}
                                                    </Row>
                                                    <Row size={1}/>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </ListItem>
                                })
                            }


                        </List>
                    </Content>
                </Container>




        );
    }
}


const styles = StyleSheet.create({
    homeContainer: {
        backgroundColor:"#ffffff",

    },
    listItem: {
        paddingLeft:0,
        marginLeft:0,

    },
    listItemThumbnail: {
        width:75,
        height:56,
        marginLeft:10
    },
    listItemText:{
        fontSize:13,
        textAlign:"left"
    },
    listItemSubText:{
        fontSize:12,
        textAlign:"left",
        fontFamily:"Montserrat-SemiBold",
        color:"#999"
    },
    listItemTextGreen:{
        fontSize:15,
        color:"#44db5e"
    },
    listItemTextBlue:{
        fontSize:15,
        color:"#2d95ff"
    },

    toolbarAndroid: {
        backgroundColor: '#E9EAED',
        height: 56,
    },
    toolbarIOS: {
        marginTop: 20,
        height: 56,
    },
    castButtonAndroid: {
        height: 24,
        width: 24,
        alignSelf: 'flex-end',
        tintColor: 'black',
    },
    castButtonIOS: {
        height: 24,
        width: 24,
        marginRight: 10,
        alignSelf: 'flex-end',
        tintColor: 'black',
    },
    stopButton: {
        alignSelf: 'flex-end',
    },

    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 2,
        backgroundColor: '#42A5F5',
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
    },
    chromecastButton: {
        backgroundColor: '#EC407A',
        marginVertical: 10,
    },
    disconnectButton: {
        marginVertical: 10,
        backgroundColor: '#f44336',
    },
    controlButton: {
        marginVertical: 10,
        backgroundColor: '#689F38',
    },
});