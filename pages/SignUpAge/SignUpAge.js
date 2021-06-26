import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text, Header, Body, Right, Left, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class SignUpAge extends Component<{}> {

    render() {

        return (

                <Container style={styles.signUpContainer}>
                    <Content style={{flex:1}}>


                        <Header style={{elevation:0}}>
                            <Left>
                                {/*<TouchableOpacity  underlayColor={"#fff"} onPress={() => this.props.navigation.navigate("SignUpConfirm")}>
                                    <Icon name="md-arrow-back" style={{fontSize: 30, color:"#fff"}} />
                                </TouchableOpacity>*/}
                            </Left>
                            <Body/>
                            <Right/>
                        </Header>


                        <Grid>
                            <Row style={{justifyContent: 'center', alignItems: 'center', height:430}} >
                                <Col>
                                    <Row size={2}>
                                        <Col style={{alignItems:"center"}}>


                                        </Col>
                                    </Row>
                                    <Row size={2}>
                                        <Col>
                                            <Text style={styles.signUpAgeCaption}>Are you 18 years or older?</Text>
                                            <Button
                                                style={styles.halfButtonNormal}
                                                full rounded
                                                onPress={()=>{
                                                    this.props.navigation.navigate("SignUpTerms");
                                                }}>
                                                <Text style={styles.halfButtonNormalText}>Yes</Text>
                                            </Button>
                                            <Button
                                                style={styles.halfButtonReverse}
                                                full rounded
                                                onPress={()=>{
                                                    this.props.navigation.navigate("SignUpTerms");
                                                }}>
                                                <Text style={styles.halfButtonReverseText}>No</Text>
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row size={1}>
                                        <Col>

                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    <Text style={styles.formSignUpAgeText}>
                                        Some of the skills demonstrated within this
                                        app could be dangerous for those who do not
                                        understand the correct execution
                                        and techniques.
                                    </Text>
                                    <Text style={styles.formSignUpAgeText}>
                                        Please do not attempt to copy the skills
                                        without the appropriate supervision.
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
    signUpAgeCaption:{
        fontSize:24,
        color:"#fff",
        textAlign:"center",
        marginBottom:24

    },
    halfButtonNormal: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:12,
        width:200,
        borderRadius:10,
        backgroundColor:"#fff",
    },
    halfButtonReverse: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:12,
        width:200,
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