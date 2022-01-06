import Vue from 'vue'
import { 
    // 按钮
    Button,
    // 容器
    Container,
    Aside,
    Header,
    Main,
    Footer,
    Menu,

    // 消息盒子
    Message,
    MessageBox,

    // 通知
    Notification,

    // 一级菜单
    Submenu,
    // 二级菜单
    MenuItem,

    // 头部面包屑 
    Breadcrumb,
    BreadcrumbItem,

    // 卡片视图
    Card,

    // 表格
    Table,
    TableColumn,
    Row,
    Col,
    Tag,

    // 开关
    Switch,

    // 悬浮提示框
    Tooltip,

    // 弹出层面板
    Dialog,

    // 表单
    Form,
    FormItem,

    // 输入框
    Input,

    // 分割竖线
    Divider,

    // 消息提示框
    Alert,

    // 图片
    Image,

    // 步骤条
    Steps,
    Step,

    // 标签页
    Tabs,
    TabPane,

    // 分页
    Pagination,


    // 选择框
    Select,
    Option,

    // 级联选择器
    Cascader,

    // 详情页
    PageHeader,

    // 弹出框
    Popover,

    // 上传框
    Upload,

    // 下载连接
    Link,

    // 进度条
    Progress,

    // 描述框
    Descriptions,
    DescriptionsItem,

    // 折叠框
    Collapse,
    CollapseItem,

    // 标记
    Badge,

    
} from 'element-ui'


Vue.use(Badge)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(DescriptionsItem)
Vue.use(Descriptions)
Vue.use(Progress)
Vue.use(Link)
Vue.use(Upload)
Vue.use(Popover)
Vue.use(PageHeader)
Vue.use(Cascader)
// Select标签要在cascader后面引入
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Image)
Vue.use(Alert)
Vue.use(Divider)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Button)

// 全局引用Message方法
Vue.prototype.$message = Message
// 全局引用Notification方法
Vue.prototype.$notify = Notification
// 全局引用Confirm方法
Vue.prototype.$confirm = MessageBox.confirm