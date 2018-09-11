import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Search, Button, Table, Dialog, Pagination, Input, Loading } from '@icedesign/base';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';
import FormView from '../../components/FormView';
import './Home.scss';
import { getToken, setAuthority, setToken } from '../../utils/authority';
import axios from 'axios';
import {
  dialogFormConfig,
} from '../Home/const';

const { Column } = Table;
const clsPrefix = 'home';
const PAGESIZE = 12;

class Home extends Component {
  constructor(props) {
    super(props);
    // 输入框
    this.value = '呼和浩特';
    // this.name = '';
    this.state = {
      isTableLoading: true,
      extractVisible: false,
      projectVisible: false,
      dataSource: [],
      current: 1,
      total: 0,
      isLoading: false,
      dialogData: {},
      dialogTitle: '查看详情',
      value: this.value,
      projectNameValue: '',
      projectPersonValue: '',
    };
  }

  componentDidMount() {
    this.getData(1, true);
    this.getCount();
  }

  getCount() {
    axios({
      method: 'get',
      headers: {
        token: getToken(),
      },
      url: 'api/count' }).then((response) => {
      const { data } = response;
      this.setState({
        count: data,
      });
    });
  }


  getData(page = 1, isInit = false) {
    // 分页参数
    const paginationParams = { // eslint-disable-line
      page,
      pageSize: PAGESIZE,
      value: this.value,
      // name: this.name,
    };

    if (!isInit) {
      this.setState({
        isTableLoading: true,
      });
    }

    axios({
      method: 'post',
      url: 'api/getAgencyList',
      headers: {
        token: getToken(),
      },
      data: {
        current: page,
        pageSize: PAGESIZE,
        extension: { opeadd: paginationParams.value },
      } }).then((response) => {
      const { data } = response;
      if (data !== undefined && data !== '') {
        this.setState({
          dataSource: data.records,
          isTableLoading: false,
          total: data.total,
          current: page,
        });
      } else {
        setToken('');
        setAuthority('');
        setTimeout(() => {
          // 跳转
          this.props.history.push('/login');
        }, 200);
      }
    });
    // Fetch().then((data) => {
    //   if (data.code === 200) {
    //     const { content } = data;
    //     this.setState({
    //       dataSource: content.dataSource,
    //       isTableLoading: false,
    //       total: content.total,
    //       current: page,
    //     });
    //
    //     alert(JSON.stringify(content.dataSource));
    //
    //   }
    // });
  }

  onClickView = () => {
    this.setState({
      extractVisible: true,
    });
  }

  onClickDelete = () => {
    Dialog.confirm({
      title: '操作',
      style: { width: '250px' },
      content: '是否要删除该数据',
      onOk: () => {
        // 发送删除请求-loading-删除成功
      },
    });
  }

  onPaginationChange = (page) => {
    this.getData(page);
  }

  onOk = () => {
    this.setState({
      extractVisible: false,
    });
  }

  onCancel = () => {
    this.setState({
      extractVisible: false,
    });
  }

  onSearch = () => {
    this.value = this.state.value;
    // this.name = this.state.name;
    this.getData(1);
  }

  onInputChange = (value) => {
    this.setState({ value });
  }
  onSynchronous = () => {
    this.setState({
      isLoading: true,
    });
    axios({
      method: 'get',
      headers: {
        token: getToken(),
      },
      url: 'api/start' }).then(() => {
      this.setState({
        isLoading: false,
      });
      this.getData(1, true);
      this.getCount();
    });
  }
  onSelected = () => {
    const params = { // eslint-disable-line
      value: this.value,
      // name: this.name,
    };
    this.setState({
      projectVisible: true,
    });
  }


  onProjectOk = () => {
    const params = { // eslint-disable-line
      value: this.value,
      projectName: this.state.projectNameValue,
      projectPerson: this.state.projectPersonValue,
    };
    this.setState({
      projectVisible: false,
    });
    axios({
      method: 'post',
      url: 'api/extractingAgency',
      headers: {
        token: getToken(),
      },
      data: {
        opeadd: params.value,
        projectname: params.projectName,
        projectperson: params.projectPerson,
      } }).then((response) => {
      const { data } = response;
      this.setState({
        dialogTitle: '抽选结果',
        extractVisible: true,
        dialogData: data,
      });
    });
  }

  onProjectCancel = () => {
    this.setState({
      projectVisible: false,
    });
  }
  onClickView = (value) => {
    this.setState({
      dialogTitle: '机构详情',
      extractVisible: true,
      dialogData: value,
    });
  };
  onClickOpen = (value) => {
    window.open('http://www.nmgp.gov.cn/category/dljg?dljgid='+value.ageinsid);
  };
  onProjectNameChange = (projectNameValue) => {
    this.setState({ projectNameValue });
  }

  onProjectPersonChange = (projectPersonValue) => {
    this.setState({ projectPersonValue });
  }


  formChange = (value) => {
    console.log(value);
  };

  renderStatus = (value, index, record) => {
    const view = <a href="javascript:void(0);" target="_blank" onClick={this.onClickView.bind(this, record)}>查看</a>;
    const open = <a href="javascript:void(0);" target="_blank" onClick={this.onClickOpen.bind(this, record)}>更多信息</a>;
    return (
      <div>
        {view}
        <span className="actions-split">|</span>
        {open}
      </div>
    );
  }

  render() {
    const { value, projectNameValue, projectPersonValue, isTableLoading, extractVisible, total, current, dataSource, count, isLoading, dialogData, dialogTitle, projectVisible } = this.state;

    return (
      <Loading visible={isLoading} shape="fusion-reactor" tip="正在同步数据...">
        <div className={`page-${clsPrefix}`}>

          <div className="navigation-label">登记入库：{count} 家，当前查询：{total} 家</div>
          <div className={`${clsPrefix}-main`}>
            <div className={`${clsPrefix}-header clearfix`}>
              {/* <Input hasClear */}
              {/* className={`${clsPrefix}-input`} */}
              {/* value={name} */}
              {/* onChange={this.onNameChange} */}
              {/* onSearch={this.onSearch} */}
              {/* placeholder="输入您要搜索的代理机构名称" */}
              {/* inputWidth={300} */}
              {/* /> */}
              <Search
                inputWidth={300}
                searchText=""
                placeholder="输入您要搜索的所在地址"
                className={`${clsPrefix}-search`}
                value={value}
                onChange={this.onInputChange}
                onSearch={this.onSearch}
              />
              <Button className={`${clsPrefix}-new`} onClick={this.onSynchronous}>同步数据</Button>
              <Button className={`${clsPrefix}-new`} onClick={this.onSelected}>数据抽选</Button>
            </div>
            <Dialog
              title={dialogTitle}
              footer={false}
              onOk={this.onOk}
              onCancel={this.onCancel}
              visible={extractVisible}
              onClose={this.onCancel}
              style={{
                width: '650px',
              }}
            >
              <FormView
                colspanType={[[6, 18]]}
                data={dialogData}
                config={dialogFormConfig}
              />
            </Dialog>

            <Dialog
              title="输入项目信息"
              onOk={this.onProjectOk}
              onCancel={this.onProjectCancel}
              visible={projectVisible}
              onClose={this.onProjectCancel}
              style={{
                width: '650px',
              }}
            >
              <FormBinderWrapper
                value={this.state.formValue}
                onChange={this.formChange}
              >
                <div>
                  <div style={styles.fromItem}>
                    <span style={{ width: 70 }}>项目名称：</span>
                    <FormBinder name="name" required max={10} message="不能为空">
                      <Input style={{ width: 500 }} value={projectNameValue} onChange={this.onProjectNameChange} />
                    </FormBinder>
                  </div>
                  <FormError style={{ marginLeft: 10 }} name="name" />
                  <div style={styles.fromItem}>
                    <span style={{ width: 70 }}>负责人：</span>
                    <FormBinder name="avatar" required max={10} message="不能为空">
                      <Input style={{ width: 500 }} value={projectPersonValue} onChange={this.onProjectPersonChange} />
                    </FormBinder>
                  </div>
                  <FormError style={{ marginLeft: 10 }} name="avatar" />
                </div>
              </FormBinderWrapper>
            </Dialog>
            <Table
              hasBorder={false}
              isZebra={false}
              dataSource={dataSource}
              isLoading={isTableLoading}
              className="rhino-table"
            >
              <Column title="代理机构名称" dataIndex="ageinsname" />
              <Column title="机构类型" dataIndex="ageinstypename" />
              <Column title="注册资本（万元）" dataIndex="regfunamout" />
              <Column title="所在地" dataIndex="areaname" />
              <Column title="联系" dataIndex="tel" />
              <Column title="操作" cell={this.renderStatus} width={200} />
            </Table>
          </div>
          <div className={`${clsPrefix}-pagination-right`}>
            <Pagination
              current={current}
              onChange={this.onPaginationChange}
              total={total}
              pageSize={PAGESIZE}
              hideOnlyOnePage
              shape="arrow-prev-only"
            />
          </div>
        </div>
      </Loading>
    );
  }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    margin: 0,
    paddingBottom: 20,
  },
  infoRow: {
    padding: '16px 0',
    display: 'flex',
    borderBottom: '1px solid #f6f6f6',
  },
  infoLabel: {
    flex: '0 0 100px',
    color: '#999',
  },
  infoDetail: {},

  fromItem: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
};

export default Home;
