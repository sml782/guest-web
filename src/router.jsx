import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// 引入主路由
import SiderBar from './routes/SiderBar';
import Login from './routes/login/Login';
import LoginSHA from './routes/login/LoginSHA';


// 引入单个页面（包括嵌套的子页面）

//服务模块
import ServiceList from './routes/service/ServiceList';
import AddVIPLounge from './routes/service/AddVIPLounge';//新增贵宾厅
import AddVIPShuttleBus from './routes/service/AddVIPShuttleBus';//新增VIP摆渡车
import AddShuttleMachine from './routes/service/AddShuttleMachine';//新增迎送机陪同
import AddParking from './routes/service/AddParking';//新增停车场
import AddLounge from './routes/service/AddLounge';//新增休息室
import AddSecurityChannel from './routes/service/AddSecurityChannel';//新增安检通道
import AddRemoteBoardGate from './routes/service/AddRemoteBoardGate';//新增远机位摆渡车
import UpdateVIPLounge from './routes/service/UpdateVIPLounge';//修改贵宾厅
import UpdateVIPShuttleBus from './routes/service/UpdateVIPShuttleBus';//修改VIP摆渡车
import UpdateShuttleMachine from './routes/service/UpdateShuttleMachine';//修改迎送机陪同
import UpdateParking from './routes/service/UpdateParking';//修改停车场
import UpdateLounge from './routes/service/UpdateLounge';//修改休息室
import UpdateSecurityChannel from './routes/service/UpdateSecurityChannel';//修改安检通道
import UpdateRemoteBoardGate from './routes/service/UpdateRemoteBoardGate';//修改远机位摆渡车
//产品模块
import ProductList from './routes/product/ProductList';//产品列表
import SetProduct from './routes/product/SetProduct';//配置产品
import AddProduct from './routes/product/AddProduct';//添加产品
//协议
import ProtocolList from './routes/protocol/ProtocolList';//协议列表
import AddProtocol from './routes/protocol/AddProtocol';//新增协议
import UpdateProtocol from './routes/protocol/UpdateProtocol';//修改协议
import SetProtocolProduct from './routes/protocol/SetProtocolProduct';//配置协议产品
//协议客户
import ProtocolClientList from './routes/protocolClient/protocolClientList';
import AddProtocolClient from './routes/protocolClient/addProtocolClient';
import UpdateProtocolClient from './routes/protocolClient/UpdateProtocolClient';
//角色模块
import addpart from './routes/part/addpart';
import partList from './routes/part/partList';
import updataPart from './routes/part/updataPart';
import rolePermission from './routes/part/rolePermission';
import choosepart from './routes/part/choosepart';


//菜单模块
import addMenu from './routes/menu/addMenu';
import reviseMenu from './routes/menu/reviseMenu';

//员工模块
import employeeList from './routes/employee/employeeList';
import addEmployee from './routes/employee/addEmployee';
import updataEmployee from './routes/employee/updataEmployee';

//预约订单
import appointmentList from './routes/order/appointmentList';
import addAppointment from './routes/order/addAppointment';
import written from './routes/order/written';//打印消费签单
import Print from './routes/order/Print';//打印消费签单
import LoungeManage from './routes/order/LoungeManage';//休息室管理
import VIPLoungeManage from './routes/order/VIPLoungeManage';//贵宾厅管理
import DispatchManage from './routes/order/DispatchManage';//贵宾厅管理
import ServEventManage from './routes/order/ServEventManage';//服务事件管理
import AddServEvent from './routes/order/AddServEvent';//添加调度事件
import UpdateServEvent from './routes/order/UpdateServEvent';//修改调度事件


//CRM
import CRMList from './routes/CRM/CRMList';//CRM列表
import UserDetail from './routes/CRM/UserDetail';//CRM用户详情

import updataAppointment from './routes/order/updataAppointment';
import LookAppointment from './routes/order/LookAppointment';
import addService from './routes/order/addService';
import serverList from './routes/order/serverList';
import updataService from './routes/order/updataService';
import LookService from './routes/order/LookService';
import accessorialServiceList from './routes/order/accessorialServiceList';

//服务账单
import ServiceBing from './routes/ServiceBillings/ServiceBing';
import loungeBill from './routes/ServiceBillings/loungeBill';
import specialCustomer from './routes/ServiceBillings/specialCustomer';
import ServiceBingDetail from './routes/ServiceBillings/ServiceBingDetail';


import Status from './routes/Status';
import StatusFail from './routes/StatusFail';




import blank from './routes/blank';




export default (
    <Router history={hashHistory}>
        <Route path="/" component={SiderBar}>
            <IndexRoute component={blank} />
            <Route path="/Status/:id/:type" component={Status} />
            <Route path="/StatusFail/:type" component={StatusFail} />
            <Route path="/serviceList" component={ServiceList} />
            <Route path="/addVIPLounge" component={AddVIPLounge} />
            <Route path="/addVIPShuttleBus" component={AddVIPShuttleBus} />
            <Route path="/addShuttleMachine" component={AddShuttleMachine} />
            <Route path="/addParking" component={AddParking} />
            <Route path="/addLounge" component={AddLounge} />
            <Route path="/addSecurityChannel" component={AddSecurityChannel} />
            <Route path="/addRemoteBoardGate" component={AddRemoteBoardGate} />
            <Route path="/updateVIPLounge" component={UpdateVIPLounge} />
            <Route path="/updateVIPShuttleBus" component={UpdateVIPShuttleBus} />
            <Route path="/updateShuttleMachine" component={UpdateShuttleMachine} />
            <Route path="/updateParking" component={UpdateParking} />
            <Route path="/updateLounge" component={UpdateLounge} />
            <Route path="/updateSecurityChannel" component={UpdateSecurityChannel} />
            <Route path="/updateRemoteBoardGate" component={UpdateRemoteBoardGate} />

            <Route path="/productList" component={ProductList} />
            <Route path="/setProduct/:productId" component={SetProduct} />
            <Route path="/addProduct" component={AddProduct} />

            <Route path="/protocolList" component={ProtocolList} />
            <Route path="/addProtocol" component={AddProtocol} />
            <Route path="/updateProtocol/:id" component={UpdateProtocol} />
            <Route path="/setProtocolProduct/:protocolId/:id/:protocolProductId" component={SetProtocolProduct} />

            <Route path="/protocolClientList" component={ProtocolClientList} />
            <Route path="/addProtocolClient" component={AddProtocolClient} />
            <Route path="/updateProtocolClient/:id" component={UpdateProtocolClient} />
            
            <Route path="/addMenu" component={addMenu} />
            <Route path="/reviseMenu" component={reviseMenu} />
            
            
            <Route path="/addpart" component={addpart} />
            <Route path="/partList" component={partList} />
            <Route path="/updataPart/:id" component={updataPart} />
            <Route path="/rolePermission/:id/:name" component={rolePermission} />
            <Route path="/choosepart" component={choosepart} />

            
            <Route path="/employeeList" component={employeeList} />
            <Route path="/addEmployee" component={addEmployee} />
            <Route path="/updataEmployee/:id" component={updataEmployee} />

            <Route path="/appointmentList" component={appointmentList} />
            <Route path="/addAppointment" component={addAppointment} />
            <Route path="/written/:id" component={written} />
            <Route path="/Print/:id" component={Print} />
            <Route path="/loungeManage" component={LoungeManage} />
            <Route path="/vIPLoungeManage" component={VIPLoungeManage} />
            <Route path="/dispatchManage" component={DispatchManage} />
            <Route path="/servEventManage" component={ServEventManage} />
            <Route path="/addServEvent" component={AddServEvent} />
            <Route path="/updateServEvent/:id" component={UpdateServEvent} />

            <Route path="/updataAppointment/:id" component={updataAppointment} />
            <Route path="/updataService/:id" component={updataService} />
             <Route path="/LookAppointment/:id" component={LookAppointment} />
            <Route path="/LookService/:id" component={LookService} />



            <Route path="/accessorialServiceList" component={accessorialServiceList} />

            
            
            <Route path="/addService" component={addService} />
            <Route path="/serverList" component={serverList} />

            <Route path="/ServiceBing" component={ServiceBing} />
            <Route path="/loungeBill" component={loungeBill} />
            <Route path="/specialCustomer" component={specialCustomer} />

            
            
            <Route path="/ServiceBingDetail" component={ServiceBingDetail} />

                

            


            <Route path="/cRMList" component={CRMList} />
            <Route path="/userDetail/:id" component={UserDetail} />
        </Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/LoginSHA" component={LoginSHA}></Route>

        

    </Router>
)


