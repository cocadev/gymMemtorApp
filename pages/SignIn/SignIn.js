import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator,View,ImageBackground } from 'react-native';
import { Container, Content, Form, Item, Input, Text, Button, Toast} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import logo from "../../assets/logo-large-support.png";
import sigInBg from "../../assets/signin-bg-support.png";
import {validateForm, userLogin} from "../../components/Store/actions";
import {NavigationActions,StackActions} from "react-navigation";


export default class SignIn extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isSendingForm:false,
            email:"",
            password:"",
        };

    }

    componentDidMount() {

        if (this.props.screenProps.state) {
            const {loginRedirect} = this.props.screenProps.state;
            const {loginRedirectScreen} = this.props.screenProps.state;

            if (loginRedirect) {
                if (loginRedirectScreen === "Home") {
                    const resetAction = StackActions.reset({
                        index: 0,
                        key:null,
                        actions: [
                            NavigationActions.navigate({routeName: loginRedirectScreen})
                        ]
                    });

                   this.props.navigation.navigate(loginRedirectScreen);
                   this.props.navigation.dispatch(resetAction);


                } else {

                    this.props.navigation.navigate(loginRedirectScreen);

                }
            }

        }

    }

    componentWillReceiveProps(nextProps){

        if(nextProps.screenProps.state){
            const {loginRedirect} = nextProps.screenProps.state;
            const {loginRedirectScreen} = nextProps.screenProps.state;
            const {loginError} = nextProps.screenProps.state;

            if(loginError){
                this.setState({isSendingForm:false},()=>{
                    Toast.show({
                        text: loginError,
                        position: 'top',
                        buttonText: 'OK',
                        duration:5000,
                        type:"warning"
                    });
                });
            } else
            if (loginRedirect) {

                if(loginRedirectScreen==="Home" || loginRedirectScreen==="FirstRun" ){
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: loginRedirectScreen})
                        ]
                    });

                    if(this.props.screenProps.state.loginRedirectScreen!==loginRedirectScreen){
                        nextProps.navigation.dispatch(resetAction);
                    }



                } else {

                    nextProps.navigation.navigate(loginRedirectScreen);
                }

                this.setState({isSendingForm: false})
            }

        }


    }

    shouldComponentUpdate(nextProps,nextState){

        return (nextProps.screenProps.changedState==="Login");

    }


    validateForm = async ()=>{

        const {dispatch} = this.props.screenProps;

        this.setState({isSendingForm:true},()=>{

            dispatch(validateForm(
                {
                    formName:"Login",
                    email:this.state.email,
                    password:this.state.password,
                }
            )).then(
                async ()=>{
                    const {validationMessage} = this.props.screenProps.state.validation;
                    const {validationStatus} = this.props.screenProps.state.validation;
                    if(validationStatus===true){

                        dispatch(userLogin(
                            {
                                username:this.state.email,
                                password:this.state.password,
                            }
                        ));

                    } else {
                        if(validationMessage){
                            this.setState({isSendingForm:false},()=>{
                                Toast.show({
                                    text: validationMessage,
                                    position: 'top',
                                    buttonText: 'OK',
                                    duration:5000,
                                    type:"warning"
                                });
                            });

                        }
                    }

                }
            );

        });




    };


    render() {


        let validation = {email:"",password:""};
        if(this.props.screenProps.state.validation){
            validation=this.props.screenProps.state.validation;
        }

        return (

            <ImageBackground source={sigInBg}
                             style={{
                                 flex: 1,
                                 flexDirection:'row',
                                 alignItems:'center',
                                 justifyContent:'center',
                                 width:"100%",
                                 height:"100%",
                                 elevation:0,
                             }}
                             imageStyle={{resizeMode: 'cover'}}
            >
            <Container style={styles.container}>

                        <Content contentContainerStyle={{flex:1}}>
                            <Grid>
                                <Row size={10} style={{justifyContent: 'center', alignItems: 'center'}}>

                              {/*      <Image style={styles.logoImage} source={logo}/>*/}

                                    <Col style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Row size={2}>

                                        </Row>
                                        <Row size={1}>
                                            <Form>
                                                <Text style={styles.formLabelCentered}>Username</Text>

                                                <Item rounded style={styles.formInputItem}>
                                                    <Input
                                                        keyboardType="email-address"
                                                        name="email"
                                                        autoCapitalize="none"
                                                        style={[styles.formInputCentered,
                                                            (validation.email==="empty"||validation.email==="invalid")?
                                                                styles.formInputError:{}
                                                        ]}
                                                        onChangeText={(text) => this.setState({email:text})}
                                                    />
                                                </Item>

                                                <Text style={styles.formLabelCentered}>Password</Text>
                                                <Item rounded style={styles.formInputItem}>
                                                    <Input
                                                        name="password"
                                                        autoCapitalize="none"
                                                        style={[styles.formInputCentered,
                                                            (validation.password==="empty")?
                                                                styles.formInputError:{}
                                                        ]}
                                                        secureTextEntry
                                                        onChangeText={(text) => this.setState({password:text})}
                                                    />
                                                </Item>
                                            </Form>
                                        </Row>
                                    </Col>


                                </Row>
                                <Row size={3}>
                                    <Col>



                                        {
                                            (this.state.isSendingForm)?
                                                <View style={{height:69, paddingTop:20}}>
                                                    <ActivityIndicator  size="large" color="#5c96f5" />
                                                </View>

                                                :
                                                <Button
                                                    style={styles.signInButton}
                                                    rounded
                                                    onPress={()=>{
                                                        this.validateForm().catch((error)=>console.log(error));
                                                    }}>
                                                    <Text style={{fontFamily:"Montserrat-SemiBold", textAlign:"center", width:256}}>Sign In</Text>
                                                </Button>
                                        }

                                        <Text style={styles.formSignUpText}>
                                            <Text>Don't have an account? </Text>

                                            <Text style={styles.formSignUpTextLink}
                                                  onPress={() => this.props.navigation.navigate("SignUp")}>
                                                Sign Up
                                            </Text>
                                        </Text>
                                    </Col>
                                </Row>
                            </Grid>
                        </Content>

            </Container>
            </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:"row",
        paddingLeft:10,
        paddingRight:10,
    },
    signInButton: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:24,
        width:256,
        borderRadius:10,
        backgroundColor:"#5c96f5",
    },
    formLabelCentered:{
        textAlign:"center",
        color:"#5c96f5"
    },
    formInputItem:{
        marginBottom:16,
        width:256,
        height:36,
        marginLeft:"auto",
        marginRight:"auto",
        borderWidth:0,
        padding:0,
        borderColor:"rgba(0,0,0,0)",

    },
    formInputCentered:{
        textAlign:"center",
        color:"#5c96f5",
        borderColor:"#5c96f5",
        borderWidth:1,
        borderRadius:10,
        height:36,
        paddingTop:0,
        paddingBottom:0,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    logoImage:{
        width:200,
        height:200,
    },
    formSignUpText:{
        textAlign:"center",
        marginTop:20,
    },
    formSignUpTextLink:{
        color:"#5c96f5",
        fontFamily:"Montserrat-SemiBold",
    },
    formInputError:{
        borderColor:"#ed1212",
    }
});