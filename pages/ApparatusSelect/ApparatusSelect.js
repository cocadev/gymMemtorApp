import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import Orientation from 'react-native-orientation';
import {StyleSheet, TouchableOpacity, FlatList, View, Image, BackHandler} from 'react-native';
import { Container, Text, Header, Body, Title, Right, Left, Spinner, Footer, FooterTab, Button, Icon, Content} from 'native-base';
import ModalFullScreen, { modalTypes } from "../../components/ModalFullScreen/ModalFullScreen";
import { Col, Row, Grid } from "react-native-easy-grid";
import {
    getCategoryData,
    setFirstRunParam,
    getFirstRunParam,
    getTutorialCounts,
    toggleSelectMode, showFooter, setSearchView
} from "../../components/Store/actions";
import SearchView from "../../components/SearchBox/SearchView";


export default class ApparatusSelect extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            modalContent:modalTypes.apparatusTutorial,
            modalData:false,
            refreshing: false,
            loading: false,
            userSelected: [],
            apparatusListData:[],
            selected: (new Map(): Map<string, boolean>),
            tutorialVideos:{
                apparatus:"https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/parental+risk+control.mp4",
            },
            dismissTutorial:false,
            showBackBtn:false,


        };
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );
    }

    componentDidMount(){

        //Orientation.lockToPortrait();
        this.loadCategoryData();

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

    }


    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.navigation.state.params){
            const {dispatch} = this.props.screenProps;
            dispatch(getCategoryData(0)).then(
                (apparatusListData)=>{
                    this.preFetchImages(apparatusListData,["imageSelected","imageUnselected"]).then(
                        this.setState({
                            apparatusListData,
                        })
                    );
                }
            );
        }

    }

    backHandler = ()=> {

        let returnValue = false;
        if(this.props.screenProps.searchView.apparatus){
            returnValue = true;
            this.props.screenProps.dispatch(setSearchView("apparatus",false)).then(()=>{
                this.props.screenProps.dispatch(showFooter());
            });
        } else
            if(this.props.screenProps.state.isSelectMode){
                returnValue = true;
                this.props.screenProps.dispatch(toggleSelectMode());
            }

        return returnValue;
    };

    loadCategoryData = (categoryId=0)=>{

        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.categoryId){
                categoryId = this.props.navigation.state.params.categoryId;
            }
        }

        this.setState({
            isLoading:true,
        },async ()=>{
            const {dispatch} = this.props.screenProps;
            const tutorialCounts = await dispatch(getTutorialCounts()).then(result=>result);
            let dismissTutorial = true;
            await dispatch(getFirstRunParam("apparatusTutorial")).then((result)=>(result)?dismissTutorial=false:dismissTutorial=true);

            dispatch(getCategoryData(categoryId)).then(
                (apparatusListData)=>{
                    this.preFetchImages(apparatusListData,["imageSelected","imageUnselected"]).then(
                        this.setState({
                            apparatusListData,
                            dismissTutorial,
                            tutorialCounts,
                            isLoading:false,
                            showBackBtn:!(categoryId===0)
                        },()=>{
                            this.refs.apparatusList.scrollToOffset({offset:0,animated:false});
                        })
                    );
                }
            );
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

    _onRefresh() {
        this.setState({refreshing: true},()=>{
            this.setState({refreshing: false});
        });

    }



    _keyExtractor = (item, index) =>item.category_id.toString();

    _onPressItem = (id: string, title:string, image, hasChildren) => {


            if(!hasChildren){
/*                if(this.props.navigation.state.params){
                    if(this.props.navigation.state.params.apparatus){
                        title = this.props.navigation.state.params.apparatus;
                    }
                }*/
                const navigateAction = NavigationActions.navigate({
                    routeName: 'GradeSelect',
                    params: {
                        categoryId:id,
                        apparatus:title,
                        grade:"",
                    },
                });
                this.props.navigation.dispatch(navigateAction);
            } else {
                this.props.navigation.push("ApparatusSelect",{
                    categoryId:id,
                    apparatus:title,
                    grade:"",
                });
/*                if(!this.state.dismissTutorial){
                    this.setState({
                        modalContent:modalTypes.apparatusTutorial,
                        modalData:{id,title,image},
                        userSelected:{id,title,image,hasChildren}
                    },()=>{
                        this.showModal();
                    });

                } else {
                    this.props.navigation.push("ApparatusSelect",{
                        categoryId:id,
                        apparatus:title,
                        grade:"",
                    });
                }*/


            }


    };

    _renderItem = ({item}) => {

        const videoCount = this.state.tutorialCounts[item.category_id];

        return (
            <TouchableOpacity activeOpacity={0.7} onPress={()=>this._onPressItem(item.category_id,item.name,item.imageUnselected,item.hasChildren)}>
                <Grid>
                    <Row>
                        <Col size={1} style={styles.listItemColImage}>

                            <Image
                                style={{flex: 3, height: undefined, width: undefined}}
                                source={{uri:item.imageUnselected}}
                                resizeMode="contain"
                            />

                        </Col>
                        <Col size={3} style={styles.listItemColTitle}>
                            <Text style={styles.listItemText}>
                                {item.name}
                            </Text>
                            <Text style={styles.listItemSubText}>
                                {videoCount+" Videos"}
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            </TouchableOpacity>

            )

    } ;


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

                if(modal.dismiss){
                    const {dispatch} = this.props.screenProps;
                    await dispatch(setFirstRunParam({apparatusTutorial:false}));
                }

                if(modal.action==="SKIP"){
                    this.setState({
                        dismissTutorial:modal.dismiss
                    },()=>{

                        if(!this.state.userSelected.hasChildren){

                            const navigateAction = NavigationActions.navigate({
                                routeName: 'GradeSelect',
                                params: {apparatus:this.state.userSelected.title, categoryId:this.state.userSelected.id,grade:""},
                            });
                            this.props.navigation.dispatch(navigateAction);
                        } else {
                            const navigateAction = NavigationActions.navigate({
                                routeName: 'ApparatusSelect',
                                params: {
                                    categoryId:this.state.userSelected.id,
                                    apparatus:this.state.userSelected.title,
                                    grade:"",
                                },
                            });
                            //this.props.navigation.dispatch(navigateAction);
                            this.props.navigation.push("ApparatusSelect",{
                                categoryId:this.state.userSelected.id,
                                apparatus:this.state.userSelected.title,
                                grade:"",
                            });
                        }

                    });

                } else
                if(modal.action==="WATCH"){

                    const nextRoute = (!this.state.userSelected.hasChildren)?{
                            routeName: 'GradeSelect',
                            params: {apparatus:this.state.userSelected.title,
                                categoryId:this.state.userSelected.id,
                                grade:""
                            }}
                            :{
                            routeName: 'ApparatusSelect',
                            params: {
                                categoryId:this.state.userSelected.id,
                                apparatus:this.state.userSelected.title,
                                grade:"",
                            }};

                    this.setState({
                        dismissTutorial:modal.dismiss
                    },()=>{
                        this.showTutorialVideo(this.state.tutorialVideos.apparatus,
                            nextRoute
                            //()=>this.nextModalAction({currentModal:"APPARATUS_TUTORIAL",action:"SKIP",dismiss:modal.dismiss})

                        );
                    });


                }
                break;

            default:
                break;


        }


        this.dismissModal();


    };


    showTutorialVideo = (video:String, closeAction=false)=>{

        const navigateAction = NavigationActions.navigate({
            routeName:"VideoPlayer",
            params:{video,singleVideo:true,closeAction},
        });
        this.props.navigation.dispatch(navigateAction);

    };


    preFetchImages = async (data,keys)=>{

        let preFetchTasks = [];
        let imageKeys = [];
        let result = {downloadedAll:false};

        data.forEach((data)=>{
            if(Array.isArray(keys)){imageKeys=keys;}
            else {imageKeys.push(keys);}
            imageKeys.forEach((key)=>{
                preFetchTasks.push(Image.prefetch(data[key]).catch(e=>console.log(e)));
            });

        });

        await Promise.all(preFetchTasks).then((results)=>{
            let downloadedAll = true;
            results.forEach((result)=>{
                if(!result){
                    downloadedAll = false;
                }
            });

            result = {downloadedAll};

        });

        return result

    };


    render() {

        let title = "Apparatus";
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.apparatus){
                title = this.props.navigation.state.params.apparatus;
            }
        }

        return (

                <Container style={styles.container}>
                    <Header style={{ paddingTop:0}}>
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

                        <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                        <Title>{title}</Title>
                        </Body>

                        <Right style={{ flex: 1 }}>
                            {
                                (this.props.screenProps.state.isSelectMode)&&
                                <TouchableOpacity activeOpacity={0.7} onPress={()=>this.props.screenProps.dispatch(toggleSelectMode())}>
                                    <Text style={{color:"#fff", fontFamily:"Montserrat-SemiBold", fontSize:13}}>
                                        {"Cancel"}
                                    </Text>
                                </TouchableOpacity>
                            }

                        </Right>


                    </Header>



                    {
                        (!this.props.screenProps.state.isSelectMode)&&
                        <SearchView
                            style={{top:0, position:"absolute"}}
                            dispatch={this.props.screenProps.dispatch}
                            screen="apparatus"
                            showSearchOverlay={this.props.screenProps.searchView.apparatus}
                            navigation={this.props.navigation}
                        />
                    }


                    <ModalFullScreen
                        modalVisible={this.state.modalVisible}
                        dismissModal={this.dismissModal}
                        nextAction={this.nextModalAction}
                        transparent={false}
                        modalContent={this.state.modalContent}
                        modalData={this.state.modalData}
                    />






                        {this.state.loading? <Spinner color="#5c96f5" /> :
                            <FlatList
                                style={{flex:1, zIndex:0 }}
                                ref="apparatusList"
                                data={this.state.apparatusListData}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                ItemSeparatorComponent={this._renderSeparator}
                            />}







                </Container>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    listItemColImage: {
        paddingLeft:15,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        height:100,

    },
    listItemColTitle: {
        paddingLeft:15,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:"center",

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