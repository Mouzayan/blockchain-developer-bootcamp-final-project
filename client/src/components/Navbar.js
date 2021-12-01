import React from 'react';

import './Navbar.scss';

export default function Navbar (props) {
  return (
    <div className="navbar">
        <h1>commodity market</h1><
        <p>connected to metamask</p>
        <p>your account address is: {props.account} </p>
    </div>
  );
};


