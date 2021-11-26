import React from 'react';

import './Navbar.scss';

export default function Navbar (props) {
  return (
    <div className="navbar">
        <a><h1>commodity market</h1></a>
        <a to="/connect to metamask">connect to metamask</a>
        <a>your account address is: {props.account} </a>
    </div>
  );
};


