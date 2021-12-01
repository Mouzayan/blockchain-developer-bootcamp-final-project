import React from 'react';

import './Navbar.scss';

export default function Navbar (props) {
  return (
    <div className="navbar">
        <div><h1>commodity market</h1></div>
        <div to="/connect to metamask">connected to metamask</div>
        <div>your account address is: {props.account} </div>
    </div>
  );
};


