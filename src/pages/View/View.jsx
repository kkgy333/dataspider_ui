/* eslint-disable no-script-url */
/**
 * 行业级设备模型查看页
 */
import React, { Component } from 'react';
import { Table, Dialog, Breadcrumb, Pagination } from '@icedesign/base';
import FormView from '../../components/FormView';
import {
  formConfig,
  dialogFormConfig,
} from './const';
import './View.scss';
import { getToken, setAuthority, setToken } from '../../utils/authority';
import axios from 'axios/index';


const { Column } = Table;
const clsPrefix = 'view';
const PAGESIZE = 12;
class DeviceModelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,

      dataSource: [],
      dialogData: {},
      isTableLoading: true,
    };
  }
  componentDidMount() {
    this.getData(1, true);
  }
  getData(page = 1, isInit = false) {
    // 分页参数
    const paginationParams = { // eslint-disable-line
      page,
      pageSize: PAGESIZE,
    };

    if (!isInit) {
      this.setState({
        isTableLoading: true,
      });
    }

    axios({
      method: 'post',
      url: 'api/getExtractingLogList',
      headers: {
        token: getToken(),
      },
      data: {
        current: page,
        pageSize: PAGESIZE,
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
  }

  onClickView = (value) => {
    this.setState({
      visible: true,
      dialogData: value,
    });
  };

  onClickDelete = (value) => {
    axios({
      method: 'post',
      url: 'api/deleteExtractingLog',
      headers: {
        token: getToken(),
      },
      data: {
        id: value.extractId,
      } }).then((response) => {
      const { data } = response;
      if (data) {
        alert('删除成功！');
        this.getData(this.state.current);
      }
    });
  };


  onClickOpen = (value) => {
    //window.location.href =
    window.open('http://www.nmgp.gov.cn/category/dljg?dljgid='+value.ageinsid);
  };

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

  onPaginationChange = (page) => {
    this.getData(page);
  }

  renderStatus = (value, index, record) => {
    const view = <a href="javascript:void(0);" target="_blank" onClick={this.onClickView.bind(this, record)}>查看</a>;
    // const deleted = <a href="javascript:void(0);" target="_blank" onClick={this.onClickDelete.bind(this, record)}>删除</a>;
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
    const { dataSource, visible, dialogData, current, total, isTableLoading } = this.state;
    return (
      <div className={`page-${clsPrefix}`}>
        <Dialog
          visible={visible}
          title="机构详情"
          footer={false}
          onOk={this.onOk}
          onCancel={this.onCancel}
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
        <div className={`page-${clsPrefix}-content`}>
          <div className={`page-${clsPrefix}-content-item`}>
            <Table
              hasBorder={false}
              isZebra={false}
              dataSource={dataSource}
              isLoading={isTableLoading}
              className="rhino-table"
            >
              <Column title="代理机构名称" dataIndex="ageinsname" />
              <Column title="联系电话" dataIndex="tel" />
              <Column title="抽选时间" dataIndex="extractTime" />
              <Column title="项目名称" dataIndex="projectName" />
              <Column title="负责人" dataIndex="projectPerson" />
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
      </div>
    );
  }
}

export default DeviceModelView;
