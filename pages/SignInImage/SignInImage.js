import React, { Component } from 'react';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import sigInBg from "../../assets/signin-bg-support.png";
import {NavigationActions} from "react-navigation";


export default class SignInImage extends Component<{}> {



    render() {


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
            <Container style={styles.container} >

                        <Content contentContainerStyle={{flex:1}}>

                            <Grid>
                                <Row size={10} style={{justifyContent: 'center', alignItems: 'center'}}>


                                </Row>
                                <Row size={3}>
                                    <Col>

                                                <Button
                                                    style={styles.signInButton}
                                                    rounded
                                                    onPress={()=>{
                                                        this.props.navigation.navigate("SignIn")
                                                    }}>
                                                    <Text style={{fontFamily:"Montserrat-SemiBold", textAlign:"center", width:256}}>Sign In</Text>
                                                </Button>


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