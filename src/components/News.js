import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import sampleOutput from './sampleOutput.json';



export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category:'general',
    };

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category:PropTypes.string,
    };
    capitalizeFirstLetter=(string)=> {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      usingFallback: false,
      error: null,
    };
    document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsApp`;
  }

  getFallbackArticles = () => {
    const requestedCategory = this.props.category?.toLowerCase();
    const articles = Array.isArray(sampleOutput.articles) ? sampleOutput.articles : [];

    if (!requestedCategory || requestedCategory === 'general') {
      return articles.slice(0, this.props.pageSize);
    }

    const filtered = articles.filter((article) => {
      const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
      return text.includes(requestedCategory);
    });

    return (filtered.length > 0 ? filtered : articles).slice(0, this.props.pageSize);
  }

  setFallbackState = (message) => {
    const fallbackArticles = this.getFallbackArticles();
    this.setState({
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      loading: false,
      usingFallback: true,
      error: message,
    });
    this.props.setProgress(100);
  }

  async updatepage(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true});
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      if (!data.ok || !Array.isArray(parsedData.articles)) {
        throw new Error(parsedData.message || 'Unable to load live headlines right now.');
      }
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults || parsedData.articles.length,
        loading: false,
        usingFallback: false,
        error: null,
      });
      this.props.setProgress(100);
    } catch (error) {
      this.setFallbackState(error.message || 'Unable to load live headlines right now.');
    }
  }

  async componentDidMount() {
    this.updatepage();
  }

  handlePrevClick = async () => {
    this.setState({page: this.state.page-1});
    this.updatepage();
  };

  handleNextClick = async () => {
    this.setState({page: this.state.page+1});   
    this.updatepage();
  };

   fetchMoreData = async() => {
    if (this.state.usingFallback) {
      return;
    }
    this.setState({page:this.state.page+1});
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d2a7e137de524cbc842917b4516506ae&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      if (!data.ok || !Array.isArray(parsedData.articles)) {
        throw new Error(parsedData.message || 'Unable to load more headlines right now.');
      }
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults || this.state.totalResults,
      });
    } catch (error) {
      this.setState({
        usingFallback: true,
        error: error.message || 'Unable to load more headlines right now.',
      });
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">NewsApp - Top {this.capitalizeFirstLetter(this.props.category)} headline </h1>
        {this.state.usingFallback && (
          <div className="alert alert-warning" role="alert">
            Showing bundled sample headlines because the live news feed is unavailable right now.
          </div>
        )}
        {this.state.loading && <Spinner />} 
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={!this.state.usingFallback && this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className=" row">
          {
            this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title}
                    description={element.description}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div >
              );
            })}
            </div>
            </InfiniteScroll>
          
        </div>
    );
  }
}

export default News
