import React, { Component } from 'react';
import {StyleSheet, Image, TouchableOpacity, View, ActivityIndicator, BackHandler} from 'react-native';
import {Container, Content, Text, Header, Body, Right, Left, Form, Button, Item, Input, Toast, Icon} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import checkImage from "../../assets/icon-check.png";
import {setSearchView, showFooter, userRegister, verifyUser} from "../../components/Store/actions";

export default class SignUpConfirm extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            isSendingForm:false,
            verifyCode:"",
            isSignUpComplete:false,
        };

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandler)
        );

    }

    componentDidMount(){
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
        );

    }

    componentWillReceiveProps(nextProps){

        const {changedState} = nextProps.screenProps;
        if(changedState==="Verify" || changedState==="Register" || changedState==="Login"){

            const {verifyRedirect} = nextProps.screenProps.state;
            const {verifyError} = nextProps.screenProps.state;

            if(verifyError){
                this.setState({isSendingForm:false},()=>{
                    Toast.show({
                        text: verifyError,
                        position: 'top',
                        buttonText: 'OK',
                        duration:5000,
                        type:"warning"
                    });
                });
            } else
            if (verifyRedirect){
                //this.props.navigation.navigate("SignUpAge");
                this.setState({isSendingForm:false,isSignUpComplete:true});
            }



        }

    }

    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    backHandler = ()=> {


        return true;

    };

/*    shouldComponentUpdate(nextProps,nextState){

        return (nextProps.screenProps.changedState==="Verify"||nextState.isSignUpComplete===true);

    }*/

    render() {

        const {dispatch} = this.props.screenProps;

        return (

                <Container style={styles.signUpContainer}>
                    <Content style={{flex:1}}>


                        <Header style={{elevation:0}}>
                            <Left>
                                {
                                    (!this.state.isSignUpComplete)&&
                                    <TouchableOpacity  underlayColor={"#fff"} onPress={() => this.props.navigation.navigate("SignUp")}>
                                        <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                    </TouchableOpacity>
                                }

                            </Left>
                            <Body/>
                            <Right/>
                        </Header>


                        {
                            (this.state.isSignUpComplete)?
                                <Grid>

                                    <Row style={{justifyContent: 'center', alignItems: 'center', height:430}} >
                                        <Col>
                                            <Row size={4}>
                                                <Col style={{alignItems:"center"}}>
                                                    <Image style={styles.checkImage} source={checkImage}/>
                                                    <Text style={styles.signUpConfirmCaption}>Welcome to</Text>
                                                    <Text style={styles.signUpConfirmCaption}>Gymnastics Mentor!</Text>
                                                </Col>
                                            </Row>
                                            <Row size={2}>
                                                <Col>
                                                    <Text style={styles.formSignUpInlineText}>Thank you for signing up!</Text>
                                                    <Text style={styles.formSignUpInlineText}>Now you may sign in with your email and password.</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row size={1}>
                                        <Col>


                                            <Button
                                                style={styles.signUpButton}
                                                full rounded
                                                onPress={()=>{
                                                    this.props.navigation.navigate("SignIn");

                                                }}>
                                                <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>Continue</Text>
                                            </Button>




                                        </Col>
                                    </Row>
                                </Grid>
                                :
                                <Grid>

                                    <Row style={{justifyContent: 'center', alignItems: 'center', height:430}} >
                                        <Col>
                                            <Row size={4}>
                                                <Col style={{alignItems:"center"}}>
                                                    <Image style={styles.checkImage} source={checkImage}/>
                                                    <Text style={styles.signUpConfirmCaption}>Welcome to</Text>
                                                    <Text style={styles.signUpConfirmCaption}>Gymnastics Mentor!</Text>
                                                </Col>
                                            </Row>
                                            <Row size={2}>
                                                <Col>
                                                    <Form>
                                                        <Text style={styles.formLabelCentered}>Enter Code</Text>
                                                        <Item rounded style={styles.formItem}>
                                                            <Input
                                                                style={styles.formInputCentered}
                                                                secureTextEntry
                                                                keyboardType="numeric"
                                                                onChangeText={(text) => this.setState({verifyCode:text})}
                                                            />
                                                        </Item>
                                                    </Form>
                                                </Col>
                                            </Row>
                                            <Row size={1}>
                                                    {
                                                        (!this.state.isSendingForm)&&
                                                        <Col>
                                                            <Text style={styles.formSignUpInlineText}>We've sent the confirmation code to your email</Text>
                                                            <Text style={styles.formSignUpInlineText}>please check your inbox.</Text>
                                                        </Col>
                                                    }
                                            </Row>
                                            <Row size={1}>
                                                <Col>
                                                    {
                                                        (!this.state.isSendingForm) &&
                                                        <Button
                                                            style={{alignSelf:"center"}}
                                                            transparent
                                                            onPress={()=>{
                                                                this.setState({isSendingForm:true},()=>{
                                                                    const {registerData} = this.props.navigation.state.params;
                                                                    dispatch(userRegister(registerData)).then(()=>{
                                                                        this.setState({isSendingForm:false});
                                                                    }).catch((error)=>console.log(error));
                                                                });

                                                            }}>
                                                            <Text style={styles.formSignUpTextLinkCenter}>Resend</Text>
                                                        </Button>
                                                    }


                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row size={1}>
                                        <Col>


                                            {
                                                (this.state.isSendingForm)?
                                                    <View style={{height:69, paddingTop:20}}>
                                                        <ActivityIndicator  size="large" color="#fff" />
                                                    </View>
                                                    :
                                                    <Button
                                                        style={styles.signUpButton}
                                                        full rounded
                                                        onPress={()=>{
                                                            this.setState({isSendingForm:true},()=>{
                                                                if(this.state.verifyCode){
                                                                    dispatch(verifyUser({code:this.state.verifyCode}));
                                                                }
                                                            });

                                                        }}>
                                                        <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>Sign Up</Text>
                                                    </Button>
                                            }


                                            <Text style={styles.formSignUpText}>
                                                <Text style={{color:"#fff"}}>Already have an account? </Text>

                                                <Text style={styles.formSignUpTextLink}
                                                      onPress={() => this.props.navigation.navigate("SignIn")}>
                                                    Sign In
                                                </Text>
                                            </Text>
                                        </Col>
                                    </Row>
                                </Grid>
                        }





                    </Content>


                </Container>

        );
    }
}


const styles = StyleSheet.create({
    signUpContainer: {
        flex: 1,
        backgroundColor: '#5c96f5',
        flexDirection:"row",
        paddingLeft:10,
        paddingRight:10,

    },
    signUpConfirmCaption:{
        fontSize:24,
        color:"#fff",
        textAlign:"center",

    },
    signUpButton: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:24,
        width:256,
        borderRadius:10,
        backgroundColor:"#fff",
    },
    formItem:{
        marginBottom:16,
        width:256,
        height:36,
        marginLeft:"auto",
        marginRight:"auto",
        borderWidth:0,
        borderColor:"rgba(0,0,0,0)",
        padding:0,
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
        paddingTop:0,
        paddingBottom:0,

    },
    formSignUpText:{
        textAlign:"center",
        marginTop:20,
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