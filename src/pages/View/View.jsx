/**
 * 行业级设备模型查看页
 */
import React, { Component } from 'react';
import { Table, Dialog, Breadcrumb,Pagination } from '@icedesign/base';
import FormView from '../../components/FormView';
import {
  formConfig,
  mockFormData,
  dialogFormConfig,
} from './const';
import './View.scss';
import axios from "axios/index";

const { Column } = Table;
const clsPrefix = 'view';
const PAGESIZE = 12;
class DeviceModelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      formData: mockFormData,
      dataSource: [],
      dialogData: {},
      isTableLoading: true
    };
  }
  componentDidMount() {
    this.getData(1, true);
  }
  getData(page = 1, isInit = false) {
    // 分页参数
    const paginationParams = { // eslint-disable-line
      page,
      pageSize: PAGESIZE
    };

    if (!isInit) {
      this.setState({
        isTableLoading: true
      });
    }

    axios({
      method: 'post',
      url: '/api/getExtractingLogList',
      data: {
        current: page,
        pageSize: PAGESIZE
      }}).then((response) => {
      const { data } = response;
      this.setState({
        dataSource: data.records,
        isTableLoading: false,
        total: data.total,
        current: page,
      });
    });
  }

  onClickView = (value) => {
    this.setState({
      visible: true,
      dialogData: value,
    });
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
    return (
      <div>
        {view}
      </div>
    );
  }

  render() {
    const { formData, dataSource, visible, dialogData, current, total,isTableLoading} = this.state;
    return (
      <div className={`page-${clsPrefix}`}>
        <Dialog
          visible={visible}
          title="查看详情"
          footer={false}
          onOk={this.onOk}
          onCancel={this.onCancel}
          onClose={this.onCancel}
          style={{
            width: '400px',
          }}
        >
          <FormView
            colspanType={[[6, 18]]}
            data={dialogData}
            config={dialogFormConfig}
          />
        </Dialog>
        <Breadcrumb>
          <Breadcrumb.Item link="/">型号管理</Breadcrumb.Item>
          <Breadcrumb.Item>查看详情</Breadcrumb.Item>
        </Breadcrumb>
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
              <Column title="机构类型" dataIndex="ageinstypename" />
              <Column title="经济性质" dataIndex="ecotypename" />
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
      </div>
    );
  }
}

export default DeviceModelView;