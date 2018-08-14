import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Search, Button, Table, Dialog, Pagination,Input,Loading } from '@icedesign/base';
import './Home.scss';
import axios from 'axios';

const { Column } = Table;
const clsPrefix = 'home';
const PAGESIZE = 12;
// TODO: 替换成自己的数据
const fields = ['id', 'ageinsname', 'ageinstypename', 'ecotypename', 'areaname', 'tel'];
const dataSourceBak = new Array(10).join(',').split(',').map((value, i) => {
  const res = {};
  fields.forEach((key) => {
    res[key] = `${key}-${i}`;
  });
  return res;
});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTableLoading: true,
      visible: false,
      dataSource: [],
      current: 1,
      total: 0,
      isLoading:false
    };
    // 输入框
    this.value = '';
    this.name ='';
  }

  componentDidMount() {
    this.getData(1, true);
    this.getCount();
  }

  getCount(){
    axios({
      method: 'get',
      url: '/api/count'}).then((response) => {
      const { data } = response;
      this.setState({
        count: data
      });
    });
  }


  getData(page = 1, isInit = false) {
    // 分页参数
    const paginationParams = { // eslint-disable-line
      page,
      pageSize: PAGESIZE,
      value: this.value,
      name:this.name
    };

    if (!isInit) {
      this.setState({
        isTableLoading: true,
      });
    }

    axios({
      method: 'post',
      url: '/api/getAgencyList',
      data: {
        current: page,
        pageSize: PAGESIZE,
        extension:{name:paginationParams.name,area:paginationParams.value}
      }}).then((response) => {
      const { data } = response;
      this.setState({
        dataSource: data.records,
        isTableLoading: false,
        total: data.total,
        current: page,
      });
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
      visible: true,
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
      visible: false,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onSearch = () => {
    this.value = this.state.value;
    this.name = this.state.name;
    this.getData(1);
  }

  onInputChange = (value) => {
    this.setState({ value });
  }

  onNameChange = (name) => {
    this.setState({ name });
  }


  onSynchronous = ()=>{
    this.setState({
      isLoading: true
    });
    axios({
      method: 'get',
      url: '/api/start'}).then((response) => {
      this.setState({
        isLoading: false
      });
      this.getData(1, true);
      this.getCount();
    });
  }
  onSelected = ()=>{
    const params = { // eslint-disable-line
      value: this.value,
      name:this.name
    };

    axios({
      method: 'post',
      url: '/api/extractingAgency',
      data: {
        name:params.name,
        area:params.value
      }}).then((response) => {
      const { data } = response;
      alert(JSON.stringify(data));
    });
  }

  renderStatus = () => {
    const splitSpan = <span className="actions-split">|</span>;
    const view = <Link to="view">查看</Link>;
    const deleteItem = <a href="javascrpt:void(0)" onClick={this.onClickDelete}>删除</a>;
    const edit = <Link to="edit">编辑</Link>;
    return (
      <div>
        {view}
        {splitSpan}
        {deleteItem}
        {splitSpan}
        {edit}
      </div>
    );
  }

  render() {
    const { value,name, isTableLoading, visible, total, current, dataSource,count, isLoading} = this.state;

    return (
      <Loading visible={isLoading} shape="fusion-reactor" tip="正在同步数据...">
      <div className={`page-${clsPrefix}`}>

        <div className="navigation-label">登记入库：{count} 家</div>
        <div className={`${clsPrefix}-main`}>
          <div className={`${clsPrefix}-header clearfix`}>
            <Input hasClear  className={`${clsPrefix}-input`} value={name}  onChange={this.onNameChange}
                   onSearch={this.onSearch} placeholder="输入您要搜索的代理机构名称" inputWidth={300}/>
            <Search
              inputWidth={300}
              searchText=""
              placeholder="输入您要搜索的所在地"
              className={`${clsPrefix}-search`}
              value={value}
              onChange={this.onInputChange}
              onSearch={this.onSearch}
            />
              <Button className={`${clsPrefix}-new`} onClick={this.onSynchronous}>同步数据</Button>
              <Button className={`${clsPrefix}-new`} onClick={this.onSelected}>数据抽选</Button>
          </div>
          <Dialog
            title="查看详情"
            onOk={this.onOk}
            onCancel={this.onCancel}
            visible={visible}
            onClose={this.onCancel}
          >
            <div style={{ width: '400px' }}>详情页面自行编辑</div>
          </Dialog>
          <Table
            hasBorder={false}
            isZebra={false}
            dataSource={dataSource}
            isLoading={isTableLoading}
            className="rhino-table"
          >
            <Column title="ID" dataIndex="id" />
            <Column title="代理机构名称" dataIndex="ageinsname" />
            <Column title="机构类型" dataIndex="ageinstypename" />
            <Column title="经济性质" dataIndex="ecotypename" />
            <Column title="所在地" dataIndex="areaname" />
            <Column title="联系" dataIndex="tel" />
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

export default Home;
