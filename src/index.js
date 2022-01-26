import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App';
// import Slider from './Slider';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.aicpass.com/v1/graphql'
  })
})

ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);