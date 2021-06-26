import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {Container, Content, Text, Header, Body, Right, Left, Form, Button, Item, Input, Toast, Title, Icon} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {validateForm, userRegister, resetValidateForm, getUserProfile} from "../../components/Store/actions";

export default class ProfileUserDetail extends Component<{}> {


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



    componentDidMount(){

        const {dispatch} = this.props.screenProps;
        dispatch(getUserProfile()).then(
            (userProfile)=>{
                this.setState({
                    email:userProfile.email,
                    firstName:userProfile.firstName,
                    lastName:userProfile.lastName,
                });
            }
        );

    }



    validateForm = async ()=>{

        const {dispatch} = this.props.screenProps;

/*        this.setState({isSendingForm:true},()=>{

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

/!*
                        dispatch(userRegister(
                            {
                                email:this.state.email,
                                password:this.state.password,
                                first_name:this.state.firstName,
                                last_name:this.state.lastName,
                            }
                        )).catch((error)=>console.log(error));*!/

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

        });*/




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

                <Container style={styles.signUpContainer} >
                    <Content>

                        <Header style={{elevation:0}}>
                            <Left style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.screenProps.dispatch(resetValidateForm()).then(()=>{
                                        this.props.navigation.goBack();
                                    });                                }}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>
                            </Left>

                            <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                            <Title>Settings</Title>
                            </Body>

                            <Right style={{ flex: 1 }}>

                            </Right>
                        </Header>


                        <Grid style={{
                            paddingLeft:10,
                            paddingRight:10,
                        }}>
                            <Row>
                                <Col>
                                <Row style={{marginBottom:10}} >
                                    <Col>
                                        <Text style={styles.signUpCaption}>Change Your Credentials?</Text>
                                        <Text style={styles.formTextCentered}>Tap on the textboxes to make any changes</Text>
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
                                                value={this.state.firstName}
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
                                                value={this.state.lastName}
                                                onChangeText={(text) => this.setState({lastName:text})}
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>E-mail</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                keyboardType="email-address"
                                                name="email"
                                                style={[styles.formInputCentered,
                                                    (validation.email==="empty"||validation.email==="invalid")?
                                                        styles.formInputError:{}
                                                ]}
                                                value={this.state.email}
                                                onChangeText={(text) => this.setState({email:text})}
                                            />
                                        </Item>
                                        <Text style={[styles.formTextCentered,{marginBottom:25}]}>A new verification code will be sent to your new email address</Text>
                                        <Text style={styles.formLabelCentered}>Current Password</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="currentPassword"
                                                style={[styles.formInputCentered,
                                                    (validation.password==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({password:text})}
                                                secureTextEntry
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>New Password</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="newPassword"
                                                style={[styles.formInputCentered,
                                                    (validation.password==="empty")?
                                                        styles.formInputError:{}
                                                ]}
                                                onChangeText={(text) => this.setState({password:text})}
                                                secureTextEntry
                                            />
                                        </Item>
                                        <Text style={styles.formLabelCentered}>Confirm New Password</Text>
                                        <Item rounded style={styles.formItem}>
                                            <Input
                                                name="confirmPassword"
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
                                                <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>SAVE</Text>
                                            </Button>
                                    }


                                </Col>
                            </Row>
                            <Row style={{marginTop:30}}>

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
        flexDirection:"row",


    },
    signUpCaption:{
        fontSize:22,
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

    formTextCentered:{
        textAlign:"center",
        color:"#fff",
        marginBottom:10,
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