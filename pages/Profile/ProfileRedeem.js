import React, { Component } from 'react';
import {StyleSheet,  TouchableOpacity, View, ActivityIndicator, Alert} from 'react-native';
import {Container, Content, Text, Header, Body, Right, Left, Form, Button, Item, Input, Toast, Title, Icon} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {validateForm, resetValidateForm} from "../../components/Store/actions";

export default class ProfileRedeem extends Component<{}> {


    constructor(props) {
        super(props);
        this.state = {
            isSendingForm:false,
            redeem:"",
            addEmail:"",
            sendCode:"",
            sendListItems:[],

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
                this.props.navigation.navigate("SignUpConfirm");
                this.setState({isSendingForm:false})
            }
        }


    }

    addEmailToList = ()=>{
        this.setState((state)=>({
            sendListItems:[state.addEmail,...state.sendListItems],
            addEmail:""
        }));
    };


    validateForm = async ()=>{

        const {dispatch} = this.props.screenProps;

        this.setState({isSendingForm:true},()=>{

            dispatch(validateForm(
                {
                    formName:"Redeem",
                    redeem:this.state.redeem,
                    sendCode:this.state.sendCode,

                }
            )).then(
                async ()=>{

                    const {validationMessage} = this.props.screenProps.state.validation;
                    const {validationStatus} = this.props.screenProps.state.validation;
                    if(validationStatus===true){

                        this.setState({isSendingForm:false},()=>{
                            Alert.alert(
                                "Send Codes",
                                "Codes Send Successfully.",
                                [
                                    {text: 'OK', onPress: () => this.props.navigation.goBack()},
                                ],
                                { cancelable: false }
                            );
                        });

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
            redeem:"",
            addCode:"",
            sendCode:"",
        };
        if(this.props.screenProps.state.validation){
            validation=this.props.screenProps.state.validation;
        }


        return (

            <Container style={styles.signUpContainer}>
                <Content>

                    <Header style={{elevation:0}}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                this.props.screenProps.dispatch(resetValidateForm("Redeem")).then(()=>{
                                    this.props.navigation.goBack();
                                });
                            }}>
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
                                        <Text style={styles.signUpCaption}>Redeem a code</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form>
                                            <Text style={styles.formLabelCentered}>Please type in your code to redeem</Text>
                                            <Item rounded style={styles.formItem}>
                                                <Input
                                                    name="redeem"
                                                    style={[styles.formInputCentered,
                                                        (validation.firstName==="empty")?
                                                            styles.formInputError:{}
                                                    ]}
                                                    autoCapitalize={'none'}
                                                    value={this.state.redeem}
                                                    onChangeText={(text) => {
                                                        this.setState({redeem:text});
                                                    }}
                                                />
                                            </Item>


                                        </Form>
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
                                                    <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>SUBMIT</Text>
                                                </Button>
                                        }
                                    </Col>
                                </Row>

                                <Row style={{height:36}}>
                                    <Col>
                                    </Col>
                                </Row>

                                <Row style={{marginBottom:10}} >
                                    <Col>
                                        <Text style={styles.signUpCaption}>Send a code</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text style={styles.formLabelCentered}>
                                            Type email address and add to send list.
                                        </Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size={3}>
                                        <Form>
                                            <Item rounded style={styles.formItemAdd}>
                                                <Input
                                                    keyboardType="email-address"
                                                    name="addEmail"
                                                    autoCapitalize={'none'}
                                                    style={[styles.formInputCentered,
                                                        (validation.firstName==="empty")?
                                                            styles.formInputError:{}
                                                    ]}
                                                    value={this.state.addEmail}
                                                    onChangeText={(text) => {
                                                        this.setState({addEmail:text});
                                                    }}
                                                />
                                            </Item>
                                        </Form>
                                    </Col>
                                    <Col size={1}>
                                        {
                                            (this.state.isSendingForm)?
                                                <View style={{height:69, paddingTop:20}}>
                                                    <ActivityIndicator  size="large" color="#fff" />
                                                </View>

                                                :
                                                <Button
                                                    style={styles.addButton}
                                                    full rounded
                                                    onPress={()=>{
                                                        this.addEmailToList();

                                                    }}>
                                                    <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>ADD</Text>
                                                </Button>
                                        }

                                    </Col>

                                </Row>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <View style={styles.formListSendCodesWrapper}>
                                {
                                    this.state.sendListItems.length>0?
                                        this.state.sendListItems.map((item,idx)=>{
                                            return <Text key={idx} style={styles.formListSendCodes}>
                                                {item}
                                            </Text>
                                        })
                                        :
                                        <Text style={styles.formListSendCodes}>
                                            Email list is empty.
                                            Add email addresses to send code.
                                        </Text>
                                }
                                </View>
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
                                            <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>SEND CODES</Text>
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
        marginTop:0,
        width:256,
        borderRadius:10,
        backgroundColor:"#fff",
    },

    addButton: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:0,
        width:70,
        height:36,
        borderRadius:10,
        backgroundColor:"#fff",
        padding:0
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

    formItemAdd:{
        marginBottom:16,
        width:240,
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
    },
    formTextCentered:{
        textAlign:"center",
        color:"#fff",
        marginBottom:10,
    },
    formListSendCodesWrapper:{
        borderColor:"#fff",
        borderRadius:5,
        borderWidth:1,
        padding:16,
        marginBottom:10,

    },

    formListSendCodes:{
        textAlign:"center",
        color:"#fff",

    },

});