import './appointment.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Table, Input, Popconfirm,Form,Select,TimePicker } from 'antd';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData} from '../../utils/config';
const format = 'HH:mm';
const Option = Select.Option;

const msg = '确定删除该用户?';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillMount=()=>{
     if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value || ' '}
            </div>
        }
      </div>
    );
  }
}


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
     this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: '25%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
    }, {
      title: '宾客信息',
      dataIndex: 'passengerType',
      width: '25%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'passengerType', text),
    },{
      title: '座位号',
      dataIndex: 'sitNo',
      width: '25%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'sitNo', text),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].sitNo;
        return (
          <div className="editable-row-operations order">
            {
              editable ?
                <span>
                  <a className='word-blue' onClick={() => this.editDone(index, 'save')}>保存</a>
                </span>
                :
                <span>
                  <a className='word-blue' onClick={() => this.edit(index)}>编辑</a>
                </span>
            }
          </div>
        );
      },
    }];
    this.state = {
        data:null,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
        data: nextProps.data,
    });
    
  }
  componentDidMount = () => {
        $(".ant-pagination").hide();
    }



  showModal = (record) => {
      this.setState({
            visible: true,
            arrIndex:record
        });
  }
  componentWillMount =()=> { 
         this.setState({
             data:this.props.data
         })
    }

 
  
  renderColumns(data, index, key, text) {
    const { editable, status } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />);
  }


  




  handleChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }
  edit(index) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data });
  }
  editDone(index, type) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });
    });
  }
  render() {
    const { data } = this.state;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;
    return <Table  dataSource={dataSource} columns={columns} />;
  }
}



EditableTable = Form.create()(EditableTable);

export default EditableTable;