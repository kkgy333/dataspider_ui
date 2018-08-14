export const mockFormData = {
  modelId: 'ss000220003',
  name: '6-26测试01——编辑',
  typeName: '仓储',
  version: '1.0',
  desc: '我只是一段描述而已',
};

export const mockTableData = [{
  typeName: '属性',
  name: '6-26属性测试02',
  identifier: 'pro_identifier02',
  desc: '6-26属性测试02描述',
}, {
  typeName: '属性',
  name: '6-26属性测试03',
  identifier: 'pro_identifier03',
  desc: 'date 描述',
}, {
  typeName: '属性',
  name: '6-26属性测试04',
  identifier: 'pro_identifier04',
  desc: 'String 描述',
}];

export const formConfig = {
  rows: [
    ['modelId', 'version'],
    ['name', 'typeName'],
    ['desc'],
  ],
  labels: {
    modelId: '型号',
    name: '型号名称',
    typeName: '类型',
    version: '版本',
    desc: '描述',
  },
};


export const dialogFormConfig = {
  rows: [
    ['ageinsname'],
    ['ageinstypename'],
    ['ecotypename'],
    ['areaname'],
    ['tel']
  ],
  labels: {
    ageinsname: '代理机构名称',
    ageinstypename: '机构类型',
    ecotypename: '经济性质',
    areaname: '所在地',
    tel:'联系'
  },
};

