import './ServiceBing.less'
import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import { hashHistory } from 'react-router';
import { Table, Input, Popconfirm,Form,Button,Modal } from 'antd';
import { serveUrl, User, cacheData } from '../../utils/config';

const msg = '确定删除该用户?';


class AutoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      arrIndex:null,
      count:1,
      data:null,
      page:1,
      rows:10,
      column:[],
      dataSource:null,
    };
  }

  componentWillMount=()=> { 
         this.getInitList(1, 10)
  }

  getInitList(page, rows) {
        const data = [];
        const _this = this;

        $.ajax({
            type: "GET",
            url: "http://192.168.0.100:8887/customer-checklist?access_token=BDvgXPpBfek25hSs0AhvuykRNQ5BG1dhvbJQ4N5J",
            //url: serveUrl+'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.1.136:8887/list?access_token="+User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
            },
            success: function (data) {
                
                _this.setState({
                  column:data.data.column,
                  dataSource:data.data.rows
                  
                })
                
            }
        });
    }

 
   
  render() {
    const { data } = this.state;
    let column = []
    this.state.column.map((v,index)=>{
      let width = 80 / this.state.column.length
      width = width +'%'
      column.push({
        title: v.displayName,
        dataIndex: v.columnName,
        key: index,
        width:width,
        render: (text, record) => {
          if(v.displayName == "航班日期"){
            return <span className="order">{moment(text).format('YYYY-MM-DD')}</span>
          }
          return <span className="order">{text}</span>
        },
      })
    })
   
    return (
      <div>
        
        <Table bordered style={{ marginLeft:'5%',marginTop:20 }} dataSource={this.state.dataSource} columns={column}  className=" serveTable"/>
      </div>
      )
  }
}


AutoTable = Form.create()(AutoTable);

export default AutoTable;
