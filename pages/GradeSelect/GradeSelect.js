import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import Orientation from 'react-native-orientation';
import {StyleSheet, TouchableOpacity, FlatList, View, Image, BackHandler} from 'react-native';
import { Container, Text, Header, Body, Title, Right, Left, Spinner, Toast, Icon} from 'native-base';
import ModalFullScreen, { modalTypes } from "../../components/ModalFullScreen/ModalFullScreen";
import { Col, Row, Grid } from "react-native-easy-grid";
import SearchView from "../../components/SearchBox/SearchView";

import {
    getGrades,
    getTutorialCounts,
    setSearchView,
    showFooter,
    toggleSelectMode
} from "../../components/Store/actions";


export default class GradeSelect extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            modalContent:modalTypes.gradeTutorial,
            modalData:false,
            refreshing: false,
            loading: false,
            userSelected: [],
            gradesListData:[],
            selected: (new Map(): Map<string, boolean>),
            tutorialVideos:{
                parental:[
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/parental+risk+control.mp4"
                ],
                grades:[
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+1.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+2.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+3.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+4.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+5.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+6.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+7.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+8.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+9.mp4",
                    "https://s3.eu-west-2.amazonaws.com/warning.video.gymnasticsmentor.com/Grades/Grade+10.mp4",
                ],
            },
            dismissTutorials:false,
            selectedUpperGrade:false,
        };
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );
    }

    componentDidMount(){

        //Orientation.lockToPortrait();
        const {dispatch} = this.props.screenProps;
        const {selectedUpperGrade} = this.props.screenProps;
        dispatch(getTutorialCounts()).then(tutorialCounts=>{
            dispatch(getGrades(this.props.navigation.state.params.categoryId)).then(
                (gradesListData)=>{
                    this.preFetchImages(gradesListData,["imageSelected","imageUnselected"]).then(
                        this.setState({
                            gradesListData,
                            tutorialCounts,
                            isLoading:false,
                            selectedUpperGrade:(selectedUpperGrade===false)?1:selectedUpperGrade,
                        })
                    );
                }
            );
        });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

    }


    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    backHandler = ()=> {

        let returnValue = false;
        if(this.props.screenProps.searchView.grade){
            returnValue = true;
            this.props.screenProps.dispatch(setSearchView("grade",false)).then(()=>{
                this.props.screenProps.dispatch(showFooter());
            });
        } else
        if(this.props.screenProps.state.isSelectMode){
            returnValue = true;
            this.props.screenProps.dispatch(toggleSelectMode());
        }

        return returnValue;
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



    _keyExtractor = (item, index) => item.category_id.toString();

    _onPressItem = (id: string, title:string, image, isUpperGrade:boolean) => {

        if(!isUpperGrade){

            const {params} = this.props.navigation.state;
            const navigateAction = NavigationActions.navigate({
                routeName: 'VideoSelect',
                params: {
                    categoryId:parseInt(id),
                    apparatus:params.apparatus,
                    grade:parseInt(title.replace("Grade ","")),
                },

            });

            this.props.navigation.dispatch(navigateAction);


        } else {
            Toast.show({
                text: "This grade is higher than your upper grade limit.",
                position: 'top',
                buttonText: 'OK',
                duration:5000,
                type:"warning"
            });
        }



    };

    _renderItem = ({item}) => {

        const isUpperGrade = parseInt(item.sort_order)>(this.state.selectedUpperGrade);
        const videoCount = this.state.tutorialCounts[item.category_id];

        return (
            <TouchableOpacity style={{
                opacity:(isUpperGrade)?0.5:1
            }}
                              activeOpacity={isUpperGrade?0.5:1}
                              onPress={()=>{
                                  this._onPressItem(item.category_id,item.name,item.imageUnselected,isUpperGrade);
                              }}>
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


    nextModalAction = (modal)=>{
        const {params} = this.props.navigation.state;
        switch(modal.currentModal){

            case modalTypes.gradeTutorial:
                if(modal.action==="SKIP"){

                    this.setState({
                        dismissTutorials:modal.dismiss,
                    },()=>{

                        const navigateAction = NavigationActions.navigate({
                            routeName: 'VideoSelect',
                            params: {
                                categoryId:parseInt(this.state.userSelected.id),
                                apparatus:params.apparatus,
                                grade:parseInt(this.state.userSelected.title.replace("Grade ","")),
                            },

                        });

                        this.props.navigation.dispatch(navigateAction);
                    });

                } else
                if(modal.action==="WATCH"){

                    this.setState({
                        dismissTutorials:modal.dismiss
                    },()=>{
                        const gradeTutorialVideo = this.state.userSelected.title.split(" ")[1]-1;
                        this.showTutorialVideo(this.state.tutorialVideos.grades[gradeTutorialVideo],
                            {
                                routeName: 'VideoSelect',
                                params: {
                                    categoryId:parseInt(this.state.userSelected.id),
                                    apparatus:params.apparatus,
                                    grade:parseInt(this.state.userSelected.title.replace("Grade ","")),
                                    showTutorial:true,
                                    video:this.state.tutorialVideos.grades[gradeTutorialVideo],
                                },

                            }
                            //()=>this.nextModalAction({currentModal:modalTypes.gradeTutorial,action:"SKIP"})
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

/*        const {params} = this.props.navigation.state;
        const navigateAction = NavigationActions.navigate({
            routeName: 'VideoSelect',
            params: {
                categoryId:parseInt(this.state.userSelected.id),
                apparatus:params.apparatus,
                grade:parseInt(this.state.userSelected.title.replace("Grade ","")),
                showTutorial:true,
                video,
            },

        });

        this.props.navigation.dispatch(navigateAction);*/
    };


    preFetchImages = async (data,keys)=>{

        let preFetchTasks = [];
        let imageKeys = [];
        let result = {downloadedAll:false};

        data.forEach((data)=>{
            if(Array.isArray(keys)){imageKeys=keys;}
            else {imageKeys.push(keys);}
            imageKeys.forEach((key)=>{
                preFetchTasks.push(Image.prefetch(data[key]));
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


    navigateToVideoSelect = ()=>{



    };



    render() {

        const {apparatus} = this.props.navigation.state.params;

        return (

            <Container style={styles.container}>
                <Header style={{ paddingTop:0}}>
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
                            <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                        </TouchableOpacity>
                    </Left>

                    <Body style={{ flex: 4,  justifyContent: 'center', alignItems: 'center' }}>
                    <Title>{apparatus}</Title>
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
                <SearchView
                    style={{top:0, position:"absolute"}}
                    dispatch={this.props.screenProps.dispatch}
                    screen="grade"
                    showSearchOverlay={this.props.screenProps.searchView.grade}
                    navigation={this.props.navigation}
                />
{/*                <Content  refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                } >*/}
                <View style={{flex:1}}>
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
                            data={this.state.gradesListData}
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