import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator,  } from 'react-native';
import {Container, Content, Text, Header, Body, Right, Left, Form, Button, Item, Input, Toast, Icon} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {validateForm, userRegister} from "../../components/Store/actions";
import {NavigationActions} from "react-navigation";

export default class SignUp extends Component<{}> {


    constructor(props) {
        super(props);
        this.state = {
            isSendingForm:false,
            email:"",
            password:"",
            confirmPassword:"",
            firstName:"",
            lastName:"",

        };

    }



    componentWillReceiveProps(nextProps){

        if(nextProps.screenProps.state){
            const {registerRedirect} = nextProps.screenProps.state;
            const {registerError} = nextProps.screenProps.state;

            if(registerError){
                this.setState({isSendingForm:false},()=>{
                    Toast.show({
                        text: registerError,
                        position: 'top',
                        buttonText: 'OK',
                        duration:5000,
                        type:"warning"
                    });
                });
            } else
            if (registerRedirect){
                const navigateAction = NavigationActions.navigate({
                    routeName:"SignUpConfirm",
                    params:{registerData:{
                            email:this.state.email,
                            password:this.state.password,
                            first_name:this.state.firstName,
                            last_name:this.state.lastName,
                        }},
                });
                this.props.navigation.dispatch(navigateAction);
                this.setState({isSendingForm:false});
            }
        }


    }


    shouldComponentUpdate(nextProps,nextState){

        return (nextProps.screenProps.changedState==="Register");

    }



    validateForm = async ()=>{

        const {dispatch} = this.props.screenProps;

        this.setState({isSendingForm:true},()=>{

            dispatch(validateForm(
                {
                    formName:"Register",
                    email:this.state.email,
                    password:this.state.password,
                    confirmPassword:this.state.confirmPassword,
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                }
            )).then(
                async ()=>{

                    const {validationMessage} = this.props.screenProps.state.validation;
                    const {validationStatus} = this.props.screenProps.state.validation;
                    if(validationStatus===true){


                        dispatch(userRegister(
                            {
                                email:this.state.email,
                                password:this.state.password,
                                first_name:this.state.firstName,
                                last_name:this.state.lastName,
                            }
                        )).catch((error)=>console.log(error));

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
            ).catch((error)=>console.log(error));

        });




    };



    render() {

        let validation = {
            email:"",
            password:"",
            confirmPassword:"",
            firstName:"",
            lastName:"",
        };
        if(this.props.screenProps.state.validation){
            validation=this.props.screenProps.state.validation;
        }


        return (

                <Container style={styles.signUpContainer}>
                    <Content>

                        <Header style={{elevation:0}}>
                            <Left>
                                <TouchableOpacity  underlayColor={"#fff"} onPress={() => this.props.navigation.navigate("SignIn")}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>
                            </Left>
                            <Body/>
                            <Right/>
                        </Header>


                        <Grid>
                            <Row style={{height:430}}>
                                <Col>
                                <Row style={{height:60}}>
                                    <Col>
                                    <Text style={styles.signUpCaption}>Sign Up.</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <Form>
                                        <Text style={styles.formLabelCentered}>First Name</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="firstName"
                                                style={[styles.formInputCentered,
                                                    (validation.firstName==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({firstName:text})}
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>Last Name</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="lastName"
                                                style={[styles.formInputCentered,
                                                    (validation.lastName==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({lastName:text})}
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>E-mail</Text>
                                        <Item rounded style={styles.formItem}>
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
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="password"
                                                autoCapitalize="none"
                                                style={[styles.formInputCentered,
                                                    (validation.password==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({password:text})}
                                                secureTextEntry
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>Confirm Password</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="confirmPassword"
                                                autoCapitalize="none"
                                                style={[styles.formInputCentered,
                                                    (validation.confirmPassword==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({confirmPassword:text})}
                                                secureTextEntry
                                            />
                                        </Item>
                                    </Form>
                                    </Col>
                                </Row>
                                </Col>
                            </Row>
                            <Row>
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
                                                    this.validateForm().catch((error)=>console.log(error));
                                                    //this.props.navigation.navigate("SignUpConfirm");
                                                }}>
                                                <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>Next</Text>
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
    signUpCaption:{
        fontSize:30,
        color:"#fff",
        textAlign:"center",
        marginBottom:10

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
    },
    formSignUpTextLink:{
        color:"#fff",
        fontFamily:"Montserrat-SemiBold",
    },
    formInputError:{
        borderColor:"#ed1212",
    }
});