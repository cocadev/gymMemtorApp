import React, { Component } from 'react';
import { StyleSheet, Image, Alert, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {Container, Content, Text, Header, Body, Right, Left, Form, Button, Item, Input, Toast, Title, Icon} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {validateForm, sendReport, resetValidateForm} from "../../components/Store/actions";

export default class ProfileReport extends Component<{}> {


    constructor(props) {
        super(props);
        this.state = {
            isSendingForm:false,
            feedback:"",
            bug:"",

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


    validateForm = async ()=>{

        const {dispatch} = this.props.screenProps;

        this.setState({isSendingForm:true},()=>{

            dispatch(validateForm(
                {
                    formName:"Report",
                    feedback:this.state.feedback,
                    bug:this.state.bug,
                }
            )).then(
                async ()=>{

                    const {validationMessage} = this.props.screenProps.state.validation;
                    const {validationStatus} = this.props.screenProps.state.validation;
                    if(validationStatus===true){

                        dispatch(sendReport({feedback:this.state.feedback,bug:this.state.bug})).then((reportResult)=>{
                            this.setState({isSendingForm:false},()=>{
                                Alert.alert(
                                    "Send Form Success",
                                    "Thanks for your feedback",
                                    [
                                        {text: 'OK', onPress: () => this.props.navigation.goBack()},
                                    ],
                                    { cancelable: false }
                                    );
                            });
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
            feedback:"",
            bug:"",
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
                                    this.props.screenProps.dispatch(resetValidateForm("Report")).then(()=>{
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
                                            <Text style={styles.signUpCaption}>Have something to share?</Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form>
                                                <Text style={styles.formLabelCentered}>Share your feedback</Text>
                                                <Item rounded style={styles.formItemMultiline}>
                                                    <Input
                                                        name="feedback"
                                                        style={[styles.formInputMultiline,
                                                            (validation.firstName==="empty")?
                                                                styles.formInputError:{}
                                                        ]}
                                                        multiline = {true}
                                                        numberOfLines = {4}
                                                        value={this.state.feedback}
                                                        onChangeText={(text) => {
                                                            this.setState({feedback:text});
                                                        }}
                                                    />
                                                </Item>
                                                <Text style={styles.formLabelCentered}>Report a bug</Text>
                                                <Item rounded style={styles.formItemMultiline}>
                                                    <Input
                                                        name="bug"
                                                        style={[styles.formInputMultiline,
                                                            (validation.lastName==="empty")?
                                                                styles.formInputError:{}
                                                        ]}
                                                        multiline = {true}
                                                        numberOfLines = {4}
                                                        value={this.state.bug}
                                                        onChangeText={(text) => this.setState({bug:text})}
                                                    />
                                                </Item>

                                                <Text style={[styles.formTextCentered,{marginBottom:25}]}>
                                                    Type your message and hit send to submit your query
                                                </Text>

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
                                                <Text style={{color:"#5c96f5", fontFamily:"Montserrat-SemiBold", }}>SEND</Text>
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

    formItemMultiline:{
        marginBottom:16,
        width:300,
        marginLeft:"auto",
        marginRight:"auto",
        borderWidth:0,
        borderColor:"rgba(0,0,0,0)",
        padding:0,
    },

    formInputMultiline:{
        color:"#5c96f5",
        borderColor:"#5c96f5",
        backgroundColor:"#ffffff",
        borderWidth:1,
        borderRadius:10,
        textAlign:"left",
        paddingTop:4,
        paddingBottom:4,
        height:98,
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