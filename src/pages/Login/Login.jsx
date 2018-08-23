/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Input, Button, Checkbox, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './Login.scss';
import axios from 'axios/index';
import { setAuthority } from '../../utils/authority';
import { setToken } from '../../utils/authority';

import { getAuthority } from '../../utils/authority';
import { getToken } from '../../utils/authority';

const { Row, Col } = Grid;

export default class Login extends Component {
  static displayName = 'Login';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        account: '',
        password: '',
        checkbox: false,
      },
    };
    // if (getAuthority() === 'admin' && getToken() !== '') {
    //   this.props.history.push('/');
    // }
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      // Feedback.toast.success('登录成功');
      axios({
        method: 'post',
        url: 'api/login',
        data: {
          username: values.account,
          password: values.password,
        } }).then((response) => {
        const { data } = response;
        if (data !== '' && data !== undefined) {
          setToken(data);
          setAuthority('admin');
          // alert(JSON.stringify(getToken()));
          // alert(JSON.stringify(getAuthority()));
          // 跳转
          this.props.history.push('/');
        } else {
          Feedback.toast.error('用户名或密码错误');
        }
      });
    });
  };

  render() {
    return (
      <div style={styles.container} className="user-login">
        <div style={styles.header}>
          <a href="#" style={styles.meta}>
             <img
             style={styles.logo}
             src="favicon.png"
             alt="logo"
             />
            <span style={styles.title} />
          </a>
           <p style={styles.desc}>代理机构抽选</p>
        </div>
        <div style={styles.formContainer}>
          {/* <h4 style={styles.formTitle}>登 录</h4> */}
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formItems}>
              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon
                    type="person"
                    size="small"
                    style={styles.inputIcon}
                  />
                  <IceFormBinder name="account" required message="必填">
                    <Input
                      size="large"
                      maxLength={20}
                      placeholder="账号"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="account" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder name="password" required message="必填">
                    <Input
                      size="large"
                      htmlType="password"
                      placeholder="密码"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="password" />
                </Col>
              </Row>

              {/*<Row style={styles.formItem}>*/}
                {/*<Col>*/}
                  {/*<IceFormBinder name="checkbox">*/}
                    {/*<Checkbox style={styles.checkbox}>记住账号</Checkbox>*/}
                  {/*</IceFormBinder>*/}
                {/*</Col>*/}
              {/*</Row>*/}

              <Row style={styles.formItem}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={styles.submitBtn}
                >
                  登 录
                </Button>
              </Row>

              {/* <Row className="tips" style={styles.tips}> */}
              {/* <a href="/" style={styles.link}> */}
              {/* 立即注册 */}
              {/* </a> */}
              {/* <span style={styles.line}>|</span> */}
              {/* <a href="/" style={styles.link}> */}
              {/* 忘记密码 */}
              {/* </a> */}
              {/* </Row> */}
            </div>
          </IceFormBinderWrapper>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    paddingTop: '100px',
    background: '#f0f2f5',
    // backgroundImage: `url${require('./images/TB1kOoAqv1TBuNjy0FjXXajyXXa-600-600.png')}`,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center',
    fontSize: '33px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: 'Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif',
    fontWeight: '600',
  },
  desc: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.45)',
  },
  logo: {
    //marginRight: '10px',
    width: '48px',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '368px',
    margin: '0 auto',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
    padding: '0',
  },
  formItemCol: {
    position: 'relative',
    padding: '0',
  },
  formTitle: {
    textAlign: 'center',
    margin: '0 0 20px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 'bold',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  submitBtn: {
    fontSize: '16px',
    height: '40px',
    lineHeight: '40px',
    background: '#3080fe',
    borderRadius: '4px',
  },
  checkbox: {
    marginLeft: '5px',
  },
  tips: {
    justifyContent: 'center',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '13px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};
