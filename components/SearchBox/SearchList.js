import React, { PureComponent } from 'react';
import { TouchableOpacity, Dimensions, View, StyleSheet, KeyboardAvoidingView, SectionList, Image, ActivityIndicator} from 'react-native';
import {  Text, Spinner, Thumbnail, Icon, ListItem,} from 'native-base';
import PropTypes from 'prop-types';


class ListItemRecent extends React.PureComponent {

    render() {
        const {item, _onPress} = this.props;
        return (
            <ListItem style={styles.listItem}>
                <TouchableOpacity style={{flexDirection:"column"}} activeOpacity={0.7} onPress={()=>{
                    _onPress(item.tutorial_id,item.category,item.name,"tutorial");
                }}>

                    <Thumbnail style={styles.listItemThumbnail} square source={{uri: item.video[0].s3_image}} />
                </TouchableOpacity>


                <TouchableOpacity style={{flexDirection:"column"}} activeOpacity={0.7} onPress={()=>{
                    _onPress(item.tutorial_id,item.category,item.name,"tutorial");
                }}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.listItemText}>{item.name}</Text>
                    </View>

                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.listItemSubText}>{(item.type==="supported")&&"Supported"}</Text>
                    </View>
                </TouchableOpacity>

            </ListItem>
        );
    }
}


class ListItemPlaylists extends React.PureComponent {

    render() {
        const {item, _onPress} = this.props;
        return (
            <ListItem style={{flexDirection:"row"}}>
                <View style={{flexDirection:"column"}}>
                    <TouchableOpacity style={{flex:1}} activeOpacity={0.7} onPress={()=>{
                        _onPress(item.playlist_id,item.type,item.name,"playlist");
                    }}>


                    </TouchableOpacity>

                </View>
                <View style={{flexDirection:"column"}}>
                    <TouchableOpacity style={{flex:1}} activeOpacity={0.7} onPress={()=>{
                        _onPress(item.playlist_id,item.type,item.name,"playlist");
                    }}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.listItemText}>{item.name}</Text>
                        </View>

                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.listItemSubText}>{item.tutorial_count+" videos"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ListItem>
        );
    }
}


class ListItemVideos extends React.PureComponent {

    render() {
        const {item, _onPress} = this.props;
        return (


            <ListItem style={styles.listItem}>
                <TouchableOpacity style={{flexDirection:"column"}} activeOpacity={0.7} onPress={()=>{
                    _onPress(item.tutorial_id,item.category,item.name,"tutorial");
                }}>

                    <Image style={styles.listItemThumbnail} square source={{uri: item.image}} />
                </TouchableOpacity>


                <TouchableOpacity style={{flexDirection:"column"}} activeOpacity={0.7} onPress={()=>{
                    _onPress(item.tutorial_id,item.category,item.name,"tutorial");
                }}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.listItemText}>{item.name}</Text>
                    </View>

                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.listItemSubText}>{(item.type==="supported")&&"Supported"}</Text>
                    </View>
                </TouchableOpacity>

            </ListItem>

        );
    }
}


class ListFooter extends React.PureComponent {

    render() {

        return (
            <View
                style={{
                    paddingVertical: 20,
                }}
            >
                <ActivityIndicator size="small" color="#5c96f5" />
            </View>

        );
    }
}





class SearchList extends PureComponent {


    _keyExtractor = (item, index) => {
        return (item.tutorial_id)?index+"-"+item.tutorial_id:(item.playlist_id)?index+"-"+item.playlist_id:index;
    };


    _renderItem = ({item,index,section}) => {

        return (section.id===1)?
            <ListItemRecent  item={item} index={index} _onPress={this.props.onPressItem}/>:(section.id===2)?
            <ListItemPlaylists item={item} index={index} _onPress={this.props.onPressItem}/>:
            <ListItemVideos item={item} index={index} _onPress={this.props.onPressItem}/>;

    };

    _renderSectionTitle = ({section:{title}}) => {
        return <ListItem itemDivider>
            <Text style={styles.listItemCategoryTitle}>{title}</Text>
        </ListItem>;
    };

    _renderFooter = () => {
        if (!this.props.isLoadingNextPage) return null;
        return <ListFooter/>;
    };

    render() {

        let recentVideosSection = [];
        if(this.props.showRecentVideos&&this.props.recentVideos){
            recentVideosSection = [{id:1, title: 'Recent Videos', data:this.props.recentVideos}];
        }
        const sections = [
            ...recentVideosSection,
            {id:2, title: 'Playlists', data:this.props.searchDataPlaylists?this.props.searchDataPlaylists:[]},
            {id:3, title: 'Videos', data:this.props.searchDataVideos?this.props.searchDataVideos:[]},
        ];

        return (
                <KeyboardAvoidingView>

                    {
                        (this.props.isLoading)?
                            <ActivityIndicator size="large" color="#5c96f5" style={[styles.searchListContainerSmall,{justifyContent:"flex-start",paddingVertical: 20}]} />
                            :
                            <SectionList
                                style={styles.searchListContainerSmall}
                                sections={sections}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                renderSectionHeader={this._renderSectionTitle}
                                stickySectionHeadersEnabled={true}
                                onEndReached={this.props.loadNextPage}
                                onEndReachedThreshold={0.01}
                                removeClippedSubviews={true}
                                ListFooterComponent={this._renderFooter}
                            />

                    }

                </KeyboardAvoidingView>

        );
    }


}


const styles = StyleSheet.create({
    searchListContainer: {
        backgroundColor:"#fff",
        marginBottom:122,
        //minHeight:Dimensions.get("screen").height-146

        //backgroundColor: 'rgba(0,0,0,0.8)',
    },

    searchListContainerSmall: {
        backgroundColor:"#fff",
        marginBottom:122,
        minHeight:Dimensions.get("screen").height-146

        //backgroundColor: 'rgba(0,0,0,0.8)',
    },

    listItem:{
        flexDirection:"row",
        paddingRight:80,
    },

    listItemThumbnail: {
        marginRight:10,
        borderColor:"#5c96f5",
        borderWidth:1,
        width:64,
        height:64,



    },
    listItemCategoryTitle: {
        fontSize:16,
        fontFamily:"Montserrat-SemiBold",

    },
    listItemText:{
        fontSize:16,
        textAlign:"left",
        fontFamily:"Montserrat-Regular",

    },

    listItemSubText:{
        fontSize:12,
        textAlign:"left",
        fontFamily:"Montserrat-Regular",
        color:"#666"
    },
});

SearchList.propTypes = {
    recentVideos:PropTypes.any,
    searchDataVideos:PropTypes.any,
    searchDataPlaylists:PropTypes.any,
    isLoading:PropTypes.bool,
    showRecentVideos:PropTypes.bool,
    onPressItem:PropTypes.func,
};

export default SearchList;