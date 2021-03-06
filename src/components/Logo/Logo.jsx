import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Logo.scss';

export default class Logo extends Component {
  render() {
    const { style } = this.props;
    return (
      <div
        className="logo"
        style={style}
      >
        <Link to="/">
          <span
            className="logo-img"
          >
            SYS
          </span>
          <div className="logo-description">
            <span className="logo-description-workbench">代理机构</span>
            <br />
            <span className="logo-description-slogan">抽选</span>
          </div>
        </Link>
      </div>
    );
  }
}
