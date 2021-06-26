import React, { Component } from 'react';
import {StyleSheet, ScrollView, BackHandler} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Container, Content, Text, Button, CheckBox} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {setFirstRunParam, setSearchView, showFooter} from "../../components/Store/actions";

export default class SignUpTerms extends Component<{}> {

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.state = {
            acceptTerms:false,
            acceptAge:false,
            showTerms:false,
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

    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

    }

    backHandler = ()=> {

        return true;

    };

    render() {

        return (

                <Container style={styles.signUpContainer}>

                    <Content style={{flex:1, }} contentContainerStyle={{flex:1}}>



                            {
                                (!this.state.showTerms)?
                                    <Grid>
                                    <Row size={6} >
                                        <Col>
                                            <Row size={3}>
                                                <Col style={{alignItems:"center"}}>
                                                    <Text style = {{
                                                        color: '#fff',
                                                        textAlign:"center",
                                                        fontSize:28,
                                                        fontFamily:"Montserrat-Regular",
                                                        marginTop:20,
                                                        marginBottom:10,
                                                    }}>
                                                        WARNING
                                                    </Text>
                                                    <Text style = {{
                                                        color: '#fff',
                                                        textAlign:"center",
                                                        fontSize:16,
                                                        fontFamily:"Montserrat-Regular",
                                                        paddingBottom:15,
                                                        paddingTop:15,
                                                    }}>
                                                        These videos may potentially trigger
                                                        seizures for people with photosensitive epilepsy.
                                                        Viewer discretion is advised.
                                                        {"\n"}
                                                        {"\n"}
                                                        Some of the skills demonstrated within this
                                                        app could be dangerous for those who do not
                                                        understand the correct execution
                                                        and techniques.
                                                        {"\n"}
                                                        {"\n"}
                                                        Please do not attempt to copy the skills
                                                        without the appropriate supervision.
                                                        {"\n"}
                                                        {"\n"}
                                                        Please ensure you complete the Warm-up
                                                        video to proceed with viewing the videos.
                                                    </Text>

                                                </Col>
                                            </Row>
                                            <Row size={1}>
                                                <Col>
                                                    <Text
                                                        onPress={()=>{
                                                            this.setState({showTerms:true});
                                                        }}
                                                        style={{
                                                            color: '#fff',
                                                            textAlign:"center",
                                                            fontSize:16,
                                                            fontFamily:"Montserrat-Regular",
                                                            paddingBottom:25,
                                                            paddingTop:5,
                                                        }}>
                                                        To proceed with the app and its contents
                                                        you must read and accept the {"\n"}
                                                        <Text style={{
                                                        color: '#fff',
                                                        textAlign:"center",
                                                        fontSize:16,
                                                        fontFamily:"Montserrat-SemiBold",
                                                        paddingBottom:5,
                                                        paddingTop:5,
                                                        textDecorationLine:"underline",
                                                    }}>Terms & Conditions</Text>
                                                    </Text>


                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>


                                <Row size={1} style={{justifyContent:"center" }}>

                                <Button
                                style={[styles.halfButtonNormal,{width:256}]}
                                full rounded
                                onPress={()=>{
                                    this.setState({showTerms:true});
                                }}>
                                <Text style={(this.state.acceptAge&&this.state.acceptTerms)?styles.halfButtonNormalText:styles.halfButtonDisabledText}>Continue</Text>
                                </Button>

                                </Row>
                                </Grid>





                                    :





                                <Grid>
                                <Row size={8} >
                                    <ScrollView style={{backgroundColor:"#fff", borderRadius:10, marginLeft:10, marginRight:10, marginTop:10}}>
                                        <Text style={styles.formSignUpTermsText}>
                                            Do you agree with the terms and conditions to use the app?
                                            {
                                                /*
                                                                                                            '•\tLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Epsum factorial non deposit quid pro quo hic escorol.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tSouvlaki ignitus carborundum e pluribus unum.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tDefacto lingo est igpay atinlay. Marquee selectus non provisio incongruous feline nolo contendre.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tQuote meon an estimate et non interruptus stadium.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tSic tempus fugit esperanto hiccup estrogen. Glorious baklava ex librus hup hey ad infinitum.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tEpsum factorial non deposit quid pro quo hic escorol.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tMarquee selectus non provisio incongruous feline nolo contendre Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tLor separat existentie es un myth.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tPor scientie, musica, sport etc, li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tIt solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.\n' +
                                                                                                            '\n' +
                                                                                                            '•\tMa quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu simplic e regulari quam li existent Europan lingues.'
                                                */
                                            }


                                        </Text>
                                    </ScrollView>
                                </Row>

                            <Row size={5}>
                                <Col>
                                <Row size={1} style={{ marginTop:10,}}>
                                    <Col size={1}/>
                                    <Col size={1}>
                                        <CheckBox checked={this.state.acceptTerms} onPress={()=>{
                                            this.setState((state)=>{ return {acceptTerms:!state.acceptTerms}} );
                                        }} color={"#5c96f5"} style={{borderColor:"#fff", }} />
                                    </Col>
                                    <Col size={8}>
                                        <Text style={{color:"#fff", paddingLeft:10,fontFamily:"Montserrat-SemiBold"}}>
                                            I've read and accept the T&C
                                        </Text>
                                    </Col>
                                    <Col size={1}/>
                                </Row>

                                <Row size={1} style={{ marginTop:10,}}>
                                    <Text style={{color:"#fff", paddingLeft:10, textAlign:"center"}}>
                                        You must be 18 years old or older to use the features of this application.
                                    </Text>
                                </Row>
                                <Row size={1} style={{ marginTop:10,}}>
                                    <Col size={1}/>
                                    <Col size={1}>
                                        <CheckBox checked={this.state.acceptAge} onPress={()=>{
                                            this.setState((state)=>{ return {acceptAge:!state.acceptAge}} );
                                        }} color={"#5c96f5"} style={{borderColor:"#fff", }} />
                                    </Col>
                                    <Col size={8}>
                                        <Text style={{color:"#fff", paddingLeft:10,fontFamily:"Montserrat-SemiBold"}}>
                                            I'm 18 years old or older
                                        </Text>
                                    </Col>
                                    <Col size={1}/>
                                </Row>

                                <Row size={2}>
                                    <Col>
                                        <Button
                                            style={(this.state.acceptAge&&this.state.acceptTerms)?styles.halfButtonNormal:styles.halfButtonDisabled}
                                            full rounded
                                            onPress={()=>{
                                                if(this.state.acceptAge&&this.state.acceptTerms){
                                                    const {dispatch} = this.props.screenProps;
                                                    dispatch(setFirstRunParam({termsConditions:false})).then(()=>{
                                                        const navigateAction = NavigationActions.navigate({
                                                            routeName: 'SignUpTutorial',
                                                        });
                                                        this.props.navigation.dispatch(navigateAction);
                                                    });
                                                }
                                            }}>
                                            <Text style={(this.state.acceptAge&&this.state.acceptTerms)?styles.halfButtonNormalText:styles.halfButtonDisabledText}>Continue</Text>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            style={{
                                                marginLeft:12,
                                                marginRight:12,
                                                marginTop:12,
                                                width:140,
                                                borderRadius:10,
                                                backgroundColor:"#5c96f5",
                                                borderColor:"#fff",
                                                borderWidth:1
                                            }}
                                            full rounded
                                            onPress={()=>{
                                                this.setState({showTerms:false});
                                            }}>
                                            <Text style={{
                                                color:"#fff",
                                                fontFamily:"Montserrat-SemiBold",
                                            }}>Cancel</Text>
                                        </Button>
                                    </Col>


                                </Row>
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
        paddingLeft:10,
        paddingRight:10,

    },
    signUpTermsCaption:{
        fontSize:16,
        color:"#fff",
        textAlign:"center",
        marginTop:24

    },
    halfButtonNormal: {
        alignSelf:"center",
        marginLeft:12,
        marginRight:12,
        marginTop:12,
        width:140,
        borderRadius:10,
        backgroundColor:"#fff",
    },
    halfButtonDisabled: {
        marginLeft:12,
        marginRight:12,
        marginTop:12,
        width:140,
        borderRadius:10,
        backgroundColor:"#ccc",
    },


    halfButtonReverse: {
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:12,
        width:140,
        borderRadius:10,
        backgroundColor:"#5c96f5",
        borderColor:"#fff",
        borderWidth:1
    },
    halfButtonNormalText: {
        color:"#5c96f5",
        fontFamily:"Montserrat-SemiBold",
    },

    halfButtonDisabledText: {
        color:"#666",
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
    formSignUpTermsText:{
        textAlign:"left",
        marginLeft:10,
        marginRight:10,
        color:"#333",
        fontSize:14,
        marginTop:10,
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