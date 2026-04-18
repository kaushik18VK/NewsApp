import React, { Component } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

export default class App extends Component {
  pageSize=5;
  apiKey="d2a7e137de524cbc842917b4516506ae"

  state={
    progress:0
  }

  setProgress=(progress)=>{
    this.setState({progress:progress})
  }

  render() {
    return (
      <div>
        <Router>
        <LoadingBar
        height={3}
        color='#f11946'
        progress={this.state.progress}
        
      />
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/general" replace />} />
            <Route path="/general" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="general" />} />
            <Route path="/business" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="business" />} />
            <Route path="/entertainment" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="entertainment" />} />
            <Route path="/health" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="health" />} />
            <Route path="/science" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="science" />} />
            <Route path="/sports" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="sports" />} />
            <Route path="/technology" element={<News setProgress={this.setProgress} apiKey={this.apiKey} pageSize={this.pageSize} country="in" category="technology" />} />
            <Route path="*" element={<Navigate to="/general" replace />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
