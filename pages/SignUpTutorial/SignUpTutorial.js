import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation'
import { Container, Content, Text, Button, Icon, CheckBox,} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {setFirstRunParam} from "../../components/Store/actions";

export default class SignUpTutorial extends Component<{}> {

    constructor() {
        super();
        this.state = {
            dismissTutorial: false,
            tutorialVideos:{
                what:"video1.mp4",
                how:"video2.mp4"
            },
        };

    }

    showTutorialVideo = (video:String)=>{

        const navigateAction = NavigationActions.navigate({
            routeName:"VideoPlayer",
            params:{video,singleVideo:true},
        });
        this.props.navigation.dispatch(navigateAction);

    };

    render() {

        return (

                <Container style={styles.signUpContainer}>

                    <Content style={{flex:1, }} contentContainerStyle={{flex:1}}>

                        <Grid style={{}}>

                            <Row size={8} style={{}}>

                                        <Col style={{alignItems:"center", justifyContent:"center"}}>
                                            <Text style={styles.signUpTutorialCaption}>
                                                Would you like to see a tutorial
                                                on how to use the app?
                                            </Text>
                                            <Text style={styles.signUpTutorialSubCaption}>
                                                These can be seen later in settings
                                            </Text>

                                            <Button
                                                iconLeft
                                                style={styles.halfButtonNormal}
                                                full rounded
                                                onPress={()=>{
                                                    //this.showTutorialVideo(this.state.tutorialVideos.what);
                                                }}>
                                                <Icon name='play' style={{color: "#5c96f5"}} />
                                                <Text style={styles.halfButtonNormalText}>What's this app for</Text>
                                            </Button>

                                            <Button
                                                iconLeft
                                                style={styles.halfButtonNormal}
                                                full rounded
                                                onPress={()=>{
                                                    //this.showTutorialVideo(this.state.tutorialVideos.how);
                                                }}>
                                                <Icon name='play' style={{color: "#5c96f5"}} />
                                                <Text style={styles.halfButtonNormalText}>How to use this app</Text>
                                            </Button>

                                            <Button
                                                style={styles.halfButtonReverse}
                                                full rounded
                                                onPress={()=>{

                                                   const {FirstRun} = this.props.screenProps;

                                                   let navigateAction;

                                                   if((!FirstRun.deSelectApparatus&&!FirstRun.gradesUpperLimit)){
                                                       navigateAction = NavigationActions.navigate({
                                                           routeName:"MainNav",
                                                       });
                                                   } else {

                                                       navigateAction = StackActions.reset({
                                                       index: 0,
                                                       actions:
                                                           [
                                                               NavigationActions.navigate({ routeName: 'ApparatusDeSelect'})
                                                           ]
                                                       });

                                                   }


                                                    if(this.state.dismissTutorial){
                                                        const {dispatch} = this.props.screenProps;
                                                        dispatch(setFirstRunParam({appTutorial:false})).then(()=>{
                                                            this.props.navigation.dispatch(navigateAction);
                                                        });
                                                    } else {
                                                        this.props.navigation.dispatch(navigateAction);
                                                    }


                                                }}>

                                                <Text style={styles.halfButtonReverseText}>Skip tutorials</Text>
                                            </Button>
                                        </Col>


                            </Row>
                            <Row size={1} style={{}}>
                                <Col size={1}/>
                                <Col size={1}>
                                    <CheckBox checked={this.state.dismissTutorial} onPress={()=>{
                                        this.setState((state)=>{ return {dismissTutorial:!state.dismissTutorial}} );
                                    }} color={"#5c96f5"} style={{borderColor:"#fff", }} />
                                </Col>
                                <Col size={8}>
                                    <Text style={{color:"#fff", paddingLeft:10}}>
                                        Don't show this message again
                                    </Text>
                                </Col>
                                <Col size={1}/>
                            </Row>
                        </Grid>


                    </Content>



                </Container>

        );
    }
}


const styles = StyleSheet.create({
    signUpContainer: {

        backgroundColor: '#5c96f5',
        paddingLeft:10,
        paddingRight:10,

    },
    signUpTutorialCaption:{
        fontSize:24,
        color:"#fff",
        textAlign:"center",
        marginBottom:24

    },
    signUpTutorialSubCaption:{
        fontSize:16,
        color:"#fff",
        textAlign:"center",
        marginBottom:24

    },
    halfButtonNormal: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:12,
        width:256,
        borderRadius:10,
        backgroundColor:"#fff",
    },
    halfButtonReverse: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:12,
        width:256,
        borderRadius:10,
        backgroundColor:"#5c96f5",
        borderColor:"#fff",
        borderWidth:1
    },
    halfButtonNormalText: {
        color:"#5c96f5",
        fontFamily:"Montserrat-SemiBold",
    },
    halfButtonReverseText: {
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
    },
    formItem:{
        marginBottom:16,
        width:256,
        height:36,
        marginLeft:"auto",
        marginRight:"auto",
        borderWidth:0,
        borderColor:"rgba(0,0,0,0)",
    },

    formLabelCentered:{
        textAlign:"center",
        color:"#fff",
        height:24
    },

    formInputCentered:{
        color:"#5c96f5",
        borderColor:"#5c96f5",
        backgroundColor:"#ffffff",
        borderWidth:1,
        borderRadius:10,
        height:36,
        textAlign:"center",

    },
    formSignUpText:{
        textAlign:"center",
        marginTop:20,
        color:"#fff",
        fontSize:14
    },
    formSignUpAgeText:{
        textAlign:"center",
        marginLeft:20,
        marginRight:20,
        color:"#fff",
        fontSize:14
    },
    formSignUpInlineText:{
        textAlign:"center",
        color:"#fff",
        fontSize:14
    },
    formSignUpTextLink:{
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
        fontSize:16
    },
    formSignUpTextLinkCenter:{
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
        textAlign:"center",
        fontSize:16
    },
    checkImage:{
        width:96,
        height:96,
        marginBottom:10,

    }
});