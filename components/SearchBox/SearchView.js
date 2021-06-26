import React, { PureComponent } from 'react';
import {View, StyleSheet,} from 'react-native';
import SearchBox from "./SearchBox";
import SearchList from "./SearchList";
import PropTypes from 'prop-types';
import {
    doSearch,
    hideFooter,
    showFooter,
    getRecentViewedVideos,
    setSearchView,
    loadTutorialData,
} from "../../components/Store/actions";
import {NavigationActions} from "react-navigation";


class SearchView extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isLoading:true,
            showSearchOverlay:false,
            showRecentVideos:true,
            recentVideos:[],
            searchData:{
                video:[],
                playlist:[],
            },
            currentSearchData:{
                video:[],
                playlist:[],
            },
            searchText:"",
            isLoadingNextPage:false,
            isSearching:false,
        };


    }

    componentDidMount(){

        this.getRecentVideos();

    }

    componentWillReceiveProps(nextProps){
        if(this.props.showSearchOverlay&&!nextProps.showSearchOverlay){
            this.cancelSearch();
        }

        if(!this.props.showSearchOverlay&&nextProps.showSearchOverlay){
            this.getRecentVideos();
        }

    }


    getRecentVideos = ()=>{
        const {dispatch} = this.props;
        dispatch(getRecentViewedVideos()).then((recentVideos)=>{
            this.setState({recentVideos});
        });
    };


    changeText = (searchText)=>{

        this.setState({lastChangeTime:Date.now()},()=>{
            setTimeout(()=>{
                if((Date.now()-this.state.lastChangeTime)>500){
                    if(searchText.length>3&&!this.state.isSearching){
                        this.doSearch(searchText);
                    } else
                    if(searchText===""&&!this.state.isSearching) {
                        this.setState({searchData:{
                                video:[],
                                playlist:[],
                            },showRecentVideos:true});
                    }

                }
            },1000)
        });



    };

    loadNextPage = ()=>{

        if(this.state.currentSearchData.video.length>=10 && !this.state.isSearching){
            this.doSearch(this.state.searchText,this.state.currentSearchData.video.pagination.next);
        }

    };

    setSearchData = (searchData)=>{

        //console.log(searchData);

        const videoSearchData = (searchData.video.pagination.current>1)?
                                [...this.state.searchData.video,...searchData.video.items]:searchData.video.items;

        const playlistSearchData = (searchData.playlist.pagination.current>1)?
            [...this.state.searchData.playlist,...searchData.playlist.items]:searchData.playlist.items;

        this.setState({
            currentSearchData:searchData,
            searchData:{
                video:videoSearchData,
                playlist:playlistSearchData,
            },
            isSearching:false,
            isLoading:false
        });
    };


    doSearch = (searchText,offset=0)=>{
        //console.log("searching: "+searchText,"offset:"+offset);
        const {dispatch} = this.props;
        this.setState({
            isSearching:true,
            isLoading:(offset===0),
            isLoadingNextPage:(offset>0),
            showRecentVideos:false,
            searchText
        },()=>{
            dispatch(doSearch(searchText,offset)).then((searchData)=>{
                this.setSearchData(searchData);
            });
        });

    };

    focusSearch = ()=>{
        this.setState({showSearchOverlay:true,isLoading:false});
        const {dispatch} = this.props;
        dispatch(setSearchView(this.props.screen,true)).then(()=>{
            dispatch(hideFooter());
        });

    };


    cancelSearch = ()=>{
        this.setState({
            showSearchOverlay:false,
            showRecentVideos:true,
            isLoading:false,
            isLoadingNextPage:false,
            currentSearchData:{
                video:[],
                playlist:[],
            },
            searchData:{
                video:[],
                playlist:[],
                searchText:"",
            }});
        const {dispatch} = this.props;
        dispatch(setSearchView(this.props.screen,false)).then(()=>{
            dispatch(showFooter());
        });

    };

    _onPressItem = async(id,category,name,type) => {
        switch(type){
            case "playlist":
                const navigateAction = NavigationActions.navigate({
                    routeName: "VideoPlayer",
                    params: {id,name},
                });
                this.props.navigation.dispatch(navigateAction);
                break;
            case "tutorial":
                await this.props.dispatch(loadTutorialData(category)).then(
                (tutorialData)=>{
                    if(tutorialData){
                        if(!tutorialData.error){
                            let index = 0;
                            tutorialData.forEach((item,idx)=>{if(item.tutorial_id===id){index=idx;}});
                            console.log(tutorialData,index);
                            const navigateAction = NavigationActions.navigate({
                                routeName: 'VideoPlayer',
                                params: {
                                    apparatus:"",
                                    grade:"",
                                    playListData:tutorialData,
                                    selectedIndex:index,
                                },
                            });
                            this.props.navigation.dispatch(navigateAction);
                        }
                    }
                }
            );
                break;
            default:
                break;
        }

/*        const navigateAction = NavigationActions.navigate({
            routeName:"VideoPlayer",
            params:{video,singleVideo:true,closeAction},
        });
        this.props.navigation.dispatch(navigateAction);*/
    };



    render() {


        return (

            <View style={(this.props.showSearchOverlay)?styles.searchViewContainerFull:styles.searchViewContainer}>
                <SearchBox
                    ref="search_box"
                    backgroundColor={(this.props.backgroundColor)?this.props.backgroundColor:"#bbb"}
                    tintColorDelete={(this.props.tintColorDelete)?this.props.tintColorDelete:"grey"}
                    onChangeText={this.changeText}
                    onSearch={this.doSearch}
                    onCancel={this.cancelSearch}
                    onFocus={this.focusSearch}
                    autoFocus={(this.props.autoFocus)?!!this.props.autoFocus:false}

                />

            {
                (this.props.showSearchOverlay)&&
                    <SearchList
                        style={{}}
                        showRecentVideos={this.state.showRecentVideos}
                        recentVideos={this.state.recentVideos}
                        searchDataVideos={this.state.searchData.video}
                        searchDataPlaylists={this.state.searchData.playlist}
                        isLoading={this.state.isLoading}
                        isLoadingNextPage={this.state.isLoadingNextPage}
                        onPressItem={this._onPressItem}
                        loadNextPage={this.loadNextPage}
                    />
            }


            </View>
        );
    }


}


const styles = StyleSheet.create({

    searchViewContainer: {

/*        flex:1,
        position:"relative",
        top:0,
        backgroundColor: '#fff',*/
    },

    searchViewContainerFull: {
/*        flex:1,
        position:"absolute",
        top:42,
        backgroundColor: '#fff',
        zIndex:2,*/
        //backgroundColor: 'rgba(0,0,0,0.8)',
    },

});

SearchView.propTypes = {
    dispatch:PropTypes.func,
    hideContent:PropTypes.func,
};

export default SearchView;